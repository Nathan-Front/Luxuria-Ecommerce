import express, { response } from "express";
import "dotenv/config";
import cors from "cors";
import {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
  PaymentsController,
  PaypalExperienceLandingPage,
  PaypalExperienceUserAction,
  //ShippingPreference,
} from "@paypal/paypal-server-sdk";
import bodyParser from "body-parser";

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
//14. delcare a map to store pending orders for later processing
const pendingOrders = new Map();
app.use(bodyParser.json());

const {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  GOOGLE_SCRIPT_URL,
  PORT = 8080,
} = process.env;

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

const ordersController = new OrdersController(client);
const paymentsController = new PaymentsController(client);

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (cart) => {
  //9. get settings from google sheet to calculate the total amount and other details
  const response = await fetch(`${GOOGLE_SCRIPT_URL}?type=paymentSettings`);
  console.log("Google Script URL:", GOOGLE_SCRIPT_URL);
  const settings = await response.json();
  //8. Create the order details to send to the PayPal API
  const items = cart.map((item) => ({
    name: item.article,
    unitAmount: {
      currencyCode: "USD",
      value: item.articlePrice.toFixed(2),
    },
    quantity: item.quantity.toString(),
    sku: String(item.id),
  }));
  //10. Calculate the total amount from the cart items
  const total = cart.reduce(
    (total, item) => total + Number(item.articlePrice) * Number(item.quantity),
    0,
  );
  //variable is from app script`
  const paymentSettings = settings.settingFees[0];
  const taxRate = Number(paymentSettings.taxFee);
  const taxAmount = Number((total * taxRate).toFixed(2));
  const deliveryFee =
    paymentSettings.shippingFee !== "free"
      ? Number(paymentSettings.DeliveryFee)
      : 0;

  const grandTotal = Number((total + taxAmount + deliveryFee).toFixed(2));
  //11. Create the order request body with the total amount and items
  const collect = {
    body: {
      intent: "CAPTURE",
      purchaseUnits: [
        {
          amount: {
            currencyCode: "USD",
            value: grandTotal.toFixed(2),

            //12. Add the breakdown of the total amount to include item total, tax, and shipping
            breakdown: {
              itemTotal: {
                currencyCode: "USD",
                value: Number(total).toFixed(2),
              },

              taxTotal: {
                currencyCode: "USD",
                value: Number(taxAmount).toFixed(2),
              },

              shipping: {
                currencyCode: "USD",
                value: Number(deliveryFee).toFixed(2),
              },
            },
          },
          // lookup item details in `cart` from database
          items,
        },
      ],
    },
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } =
      await ordersController.createOrder(collect);
    // Get more response info...
    // const { statusCode, headers } = httpResponse;
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
      //13. return the order calculation details to save in the pendingOrders map for later processing
      orderCalculation: {
        subTotal: total,
        taxRate,
        taxAmount,
        deliveryFee,
        grandTotal,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      // const { statusCode, headers } = error;
      throw new Error(error.message);
    }
  }
};

// createOrder route for paypal
app.post("/api/orders", async (req, res) => {
  try {
    console.log("🔥 Order received from frontend:");
    console.log(JSON.stringify(req.body, null, 2));
    // use the cart information passed from the front-end to calculate the order amount detals
    //15. use the cart information passed from the front-end
    const { cart, customer, paymentMethod } = req.body;
    console.log("Cart received:", cart);
    console.log("Customer received:", customer);
    console.log("Payment method received:", paymentMethod);
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        error: "Cart is empty.",
      });
    }
    const { jsonResponse, httpStatusCode, orderCalculation } =
      await createOrder(cart);
    //16. Save the order details in the pendingOrders map for later processing
    if (!jsonResponse?.id) {
      throw new Error("PayPal did not return an order ID");
    }
    pendingOrders.set(jsonResponse.id, {
      cart,
      customer,
      paymentMethod,
      orderCalculation,
    });
    console.log("Saved pending order:", pendingOrders.get(jsonResponse.id));

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID) => {
  const collect = {
    id: orderID,
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } =
      await ordersController.captureOrder(collect);
    // Get more response info...
    // const { statusCode, headers } = httpResponse;
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      // const { statusCode, headers } = error;
      throw new Error(error.message);
    }
  }
};

// captureOrder route for paypal
app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    //17. capture the order details to pass to apps script for order processing
    const capture = jsonResponse.purchase_units[0].payments.captures[0];
    //18. get the order data to the pending map
    const savedOrder = pendingOrders.get(orderID);
    if (!savedOrder) {
      return res.status(404).json({
        success: false,
        error: "Order not found.",
      });
    }
    //19. pass the block of cart and other necessary details needed in google sheet
    if (capture.status === "COMPLETED") {
      console.log("Payment completed");
      console.log("Customer:", savedOrder.customer);
      console.log("Cart:", savedOrder.cart);
      const orderData = buildOrderData({
        orderID: jsonResponse.id,
        captureID: capture.id,
        date: new Date(capture.create_time)
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
        customer: savedOrder.customer,
        cart: savedOrder.cart,
        status: jsonResponse.status,
        orderCalculation: {
          subTotal: savedOrder.orderCalculation.subTotal,
          taxRate: savedOrder.orderCalculation.taxRate,
          taxAmount: savedOrder.orderCalculation.taxAmount,
          deliveryFee: savedOrder.orderCalculation.deliveryFee,
          grandTotal: savedOrder.orderCalculation.grandTotal,
        },
        paymentMethod: savedOrder.paymentMethod,
      });
      console.log("Order data to send to Google Script:", orderData);
      //21. fetch the google sheet and pass the orderData
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      //22. get the result from the google script
      console.log("Google Script status:", response.status);
      console.log(
        "Google Script content type:",
        response.headers.get("content-type"),
      );

      const result = await response.json();
      if (!result.success) {
        return res.status(500).json(result);
      }
      //23. return the result from the google script to the front-end onApprove function
      //Since we are not returning the original format of order to frontend
      //be sure to adjust it in onApprove if catching some errors
      return res.status(httpStatusCode).json({
        success: true,
        type: "paypal",
        orderID: jsonResponse.id,
        captureID: capture.id,
        amount: savedOrder.orderCalculation.grandTotal,
        status: jsonResponse.status,
        paymentMethod: savedOrder.paymentMethod,
        googleScript: result,
        paypal: jsonResponse, //use this value to adjust value in onApprove functions
      });
    }
    // Fallback if payment wasn't completed
    return res.status(httpStatusCode).json({
      paypal: jsonResponse,
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({
      error: "Failed to capture order.",
      error: error.message,
      // temporary debugging
      stack: error.stack,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Node server listening at http://localhost:${PORT}/`);
});

//20. build the order data to send to apps script for saving
function buildOrderData({
  orderID,
  captureID,
  date,
  customer,
  cart,
  status,
  orderCalculation,
  paymentMethod,
}) {
  return {
    //this formType is declared in apps script to know which function to call in the script
    formType: "orders",
    orderID,
    captureID,
    date,
    name: customer.name,
    address: customer.shippingAddress,
    phone: customer.contactNumber,
    email: customer.email,
    status,

    items: cart.map((item) => ({
      productId: item.id,
      product: item.article,
      price: item.articlePrice,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    })),

    deliveryFee: orderCalculation.deliveryFee,
    taxRate: orderCalculation.taxRate,
    taxAmount: orderCalculation.taxAmount,
    subTotal: orderCalculation.subTotal,
    grandTotal: orderCalculation.grandTotal,

    paymentMethod,
  };
}

// captureOrder route for COD
app.post("/api/orders/cod", async (req, res) => {
  try {
    //1 get the cart from frontend
    const { cart, customer, paymentMethod } = req.body;
    //2 get the payment setting from google sheet
    const scriptResponse = await fetch(
      `${GOOGLE_SCRIPT_URL}?type=paymentSettings`,
    );
    const settings = await scriptResponse.json();
    //3 get/compute necessary data to pass to apps script
    const total = cart.reduce(
      (total, item) =>
        total + Number(item.articlePrice) * Number(item.quantity),
      0,
    );
    const paymentSettings = settings.settingFees[0];
    const taxRate = Number(paymentSettings.taxFee);
    const taxAmount = Number((total * taxRate).toFixed(2));
    const deliveryFee =
      paymentSettings.shippingFee !== "free"
        ? Number(paymentSettings.DeliveryFee)
        : 0;
    const grandTotal = Number((total + taxAmount + deliveryFee).toFixed(2));
    //create COD ID
    const orderID = `COD-${now.getFullYear()}${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(
      Math.random() * 9000 + 1000,
    )}`;

    //4 do same format before passing the calculation data like in paypal
    const orderCalculation = {
      total,
      taxRate,
      taxAmount,
      deliveryFee,
      grandTotal,
    };

    //5 pass the data to builder function
    const orderData = buildOrderData({
      orderID,
      captureID: null,
      date: new Date().toISOString().replace("T", " ").substring(0, 19),
      customer,
      cart,
      status: "Pending delivery",
      orderCalculation,
      paymentMethod,
    });
    console.log("COD order data to send to Google Script:", orderData);

    //6 pass the built data to apps script
    const sheetResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    console.log("Google Script status:", sheetResponse.status);
    //7 capture the response
    const response = await sheetResponse.json();
    if (!response.success) {
      return res.status(500).json(response);
    }
    //8 return the response to frontend for UI updating
    res.json({
      success: true,
      type: "cod",
      orderID,
      captureID: null,
      amount: grandTotal,
      status: "Pending Payment",
      paymentMethod,
      googleScript: result,
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
