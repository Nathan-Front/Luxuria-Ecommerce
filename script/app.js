import { fetchSpecificSheet } from "./fetchApps.js";

let paypalButtons = null;
//1. Set the server URL to your deployed server
const SERVER_URL = "https://luxuria-ecommerce.onrender.com";
//4. fetch needed data from google sheet and return the order details here
export async function fetchCartData() {
  try {
    const products = await fetchSpecificSheet("shop-articles", "products");
    return getOrderDetails(products);
  } catch (error) {
    console.log(error);
  }
}
//3. Get order details from the form and local storage
//*optional data from google sheet if needed
function getOrderDetails(products) {
  console.log("Products:", products);
  const storage = JSON.parse(localStorage.getItem("luxuriaTemp")) || [];
  const cartData = storage.map((storageItem) => {
    const product = products.find(
      (item) => String(item.No) === String(storageItem.No),
    );
    return { ...storageItem, product };
  });
  console.log("Cart Data:", cartData);
  const cart = cartData.map((item) => ({
    id: item.No,
    article: item.product.article,
    color: item.color,
    size: item.size ? item.size : "N/A",
    articlePrice: item.product.price,
    quantity: item.quantity,
    priceTotal: parseFloat(item.product.price) * item.quantity,
  }));
  console.log("Cart:", cart);
  const name = document.querySelector("#full-name");
  const email = document.querySelector("#email");
  const contactNumber = document.querySelector("#contact-number");
  const shippingAddress = document.querySelector("#shipping-address");
  return {
    cart,
    customer: {
      name: name.value,
      shippingAddress: shippingAddress.value,
      contactNumber: contactNumber.value,
      email: email.value,
    },
    paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')
      ?.value,
  };
}

export function initPayPal() {
  if (!window.paypal) {
    console.error("PayPal SDK has not loaded.");
    return;
  }
  const paypalContainer = document.querySelector("#paypal-button-container");
  if (!paypalContainer) {
    return;
  }

  paypalButtons = window.paypal.Buttons({
    style: {
      shape: "rect",
      layout: "vertical",
      color: "gold",
      label: "paypal",
    },
    message: {
      amount: 100,
    },
    async createOrder() {
      try {
        //5. get the returned order details
        const orderDetails = await fetchCartData();
        console.log("Order Details:", orderDetails);
        //2.Use the created URL from render server
        const response = await fetch(`${SERVER_URL}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // use the "body" param to optionally pass additional order information
          // like product ids and quantities
          //6. Send the order details to the server
          body: JSON.stringify(orderDetails),
        });

        const orderData = await response.json();
        console.log("🔥 PayPal response from server:", orderData);

        if (orderData.id) {
          return orderData.id;
        }
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      } catch (error) {
        console.error(error);
        // resultMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
        throw error;
      }
    },
    async onApprove(data, actions) {
      try {
        //7. Approve the order on the server
        const response = await fetch(
          `${SERVER_URL}/api/orders/${data.orderID}/capture`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        //24. return the result from the server to the front-end
        const result = await response.json();
        // Three cases to handle:
        //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        //   (2) Other non-recoverable errors -> Show a failure message
        //   (3) Successful transaction -> Show confirmation or thank you message
        const errorDetail = result?.details?.[0];

        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
          // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          // recoverable state, per
          // https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
          return actions.restart();
        } else if (errorDetail) {
          // (2) Other non-recoverable errors -> Show a failure message
          throw new Error(`${errorDetail.description} (${result.debug_id})`);
        }
        //25. Fallback if payment wasn't completed use the result from the server to show the error message
        //adjust the reulst here since returned data have different format
        //from the original order details passed to server.js side
        else if (!result.paypal.purchase_units) {
          throw new Error(JSON.stringify(result.paypal));
        } else {
          // (3) Successful transaction -> Show confirmation or thank you message
          // Or go to another URL:  actions.redirect('thank_you.html');
          /* 
          if (result.status === "COMPLETED") {
            resultMessage(
              `Transaction ${result.status}: ${result.captureID}<br>
              <br>Thank you for your purchase!<br>`,
            );

            console.log("Payment successful!");
  console.log("Order ID:", result.orderID);
  console.log("Capture ID:", result.captureID);
  console.log("Amount:", result.amount); */

          const transaction =
            result?.paypal?.purchase_units?.[0]?.payments?.captures?.[0] ||
            result?.paypal?.purchase_units?.[0]?.payments?.authorizations?.[0];
          //26. Show a result message to the user for successful transaction
          //can use the provided HTML but can create own alert or modal to show the result message
          resultMessage(
            `Transaction ${transaction.status}: ${transaction.id}<br>
          <br>Thank you for trying our service!<br>`,
          );
          console.log(
            "Capture result",
            result.paypal,
            JSON.stringify(result, null, 2),
          );
        }
      } catch (error) {
        console.error(error);
        resultMessage(
          `Sorry, your transaction could not be processed...<br><br>${error}`,
        );
      }
    },
  });
  paypalButtons.render("#paypal-button-container");
}

export function paymentRadioButton() {
  const paypalButtonContainer = document.querySelector(".paypal-btn-con");
  const codButtonContainer = document.querySelector(".cod-btn-con");
  const radio = document.querySelector(
    'input[name="paymentMethod"]:checked',
  )?.value;
  if (!paypalButtonContainer || !codButtonContainer) return;
  if (radio === "paypal") {
    paypalButtonContainer.classList.add("showPaypalBtn");
    codButtonContainer.classList.remove("showCodBtn");
  }
  if (radio === "cash-on-delivery") {
    codButtonContainer.classList.add("showCodBtn");
    paypalButtonContainer.classList.remove("showPaypalBtn");
  }
}
// Example function to show a result to the user. Your site's UI library can be used instead.
function resultMessage(message) {
  const container = document.querySelector("#result-message");
  container.innerHTML = message;
}
