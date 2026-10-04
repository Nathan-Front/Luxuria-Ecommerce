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
//11. delcare a map to store pending orders for later processing
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
  //7. Create the order details to send to the PayPal API
  const items = cart.map((item) => ({
    name: item.article,
    unitAmount: {
      currencyCode: "USD",
      value: item.articlePrice.toFixed(2),
    },
    quantity: item.quantity.toString(),
    sku: String(item.id),
  }));
  //8. Calculate the total amount from the cart items
  const totalAmount = cart.reduce(
    (total, item) => total + Number(item.articlePrice) * Number(item.quantity),
    0,
  );
  //9. Create the order request body with the total amount and items
  const collect = {
    body: {
      intent: "CAPTURE",
      purchaseUnits: [
        {
          amount: {
            currencyCode: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              itemTotal: {
                currencyCode: "USD",
                value: totalAmount.toFixed(2),
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
    //10. use the cart information passed from the front-end
    const { cart, customer, paymentMethod } = req.body;
    console.log("Cart received:", cart);
    console.log("Customer received:", customer);
    console.log("Payment method received:", paymentMethod);
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        error: "Cart is empty.",
      });
    }
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    //12. Save the order details in the pendingOrders map for later processing
    if (!jsonResponse?.id) {
      throw new Error("PayPal did not return an order ID");
    }
    pendingOrders.set(jsonResponse.id, {
      cart,
      customer,
      paymentMethod,
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
    //13. capture the order details to pass to apps script for order processing
    const capture = jsonResponse.purchase_units[0].payments.captures[0];
    //14. build the order data to send to apps script for order processing
    const savedOrder = pendingOrders.get(orderID);
    if (!savedOrder) {
      return res.status(404).json({
        success: false,
        error: "Order not found.",
      });
    }
    if (capture.status === "COMPLETED") {
      console.log("Payment completed");
      console.log("Customer:", savedOrder.customer);
      console.log("Cart:", savedOrder.cart);
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
