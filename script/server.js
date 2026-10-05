import express from "express";
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
//13. delcare a map to store pending orders for later processing
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
  const paymentSettings = settings.settings[0];
  const taxRate = Number(paymentSettings.taxFee);
  const taxAmount = Number((total * taxRate).toFixed(2));
  const deliveryFee =
    paymentSettings.shippingFee !== "free"
      ? Number(paymentSettings.DeliveryFee)
      : 0;

  const grandTotal = Number((total + taxAmount + deliveryFee).toFixed(2));
  //13. Create the order request body with the total amount and items
  const collect = {
    body: {
      intent: "CAPTURE",
      purchaseUnits: [
        {
          amount: {
            currencyCode: "USD",
            value: grandTotal.toFixed(2),

            //11. Add the breakdown of the total amount to include item total, tax, and shipping
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
      //12. return the order calculation details to save in the pendingOrders map for later processing
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
    //12. use the cart information passed from the front-end
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
    //14. Save the order details in the pendingOrders map for later processing
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
    //15. capture the order details to pass to apps script for order processing
    const capture = jsonResponse.purchase_units[0].payments.captures[0];
    //16. build the order data to send to apps script for order processing
    const savedOrder = pendingOrders.get(orderID);
    if (!savedOrder) {
      return res.status(404).json({
        success: false,
        error: "Order not found.",
      });
    }
    //17. pass the block of cart and other necessary details needed in google sheet
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
      });
    }
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

app.listen(PORT, () => {
  console.log(`Node server listening at http://localhost:${PORT}/`);
});

function buildOrderData({
  orderID,
  captureID,
  status,
  date,
  customer,
  cart,
  orderCalculation,
  paymentMethod,
}) {
  return {};
}
