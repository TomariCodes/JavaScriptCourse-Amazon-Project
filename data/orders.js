import { getProduct, loadProductsFetch } from "./products.js";
import { formatCurrency } from "../scripts/utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { reAddToCart, cart, setCart, updateCartQuantity } from "./cart.js";
export const orders = JSON.parse(localStorage.getItem("orders")) || [];

await loadProductsFetch();

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

let orderDetails = ``;

orders.forEach((order) => {
  const orderDate = dayjs(order.orderTime);
  const orderDateFormat = orderDate.format("MMMM D");

  orderDetails += `<div class="order-container-${order.id}">
    <div class="order-header">
    <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderDateFormat}</div>
                </div>
              <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
              </div>
              </div>

              <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
              </div>
              </div>`;

  order.products.forEach((product) => {
    const orderId = order.id;
    const productId = product.productId;

    const trackingUrl = new URL("/tracking.html", window.location.href);
    trackingUrl.searchParams.set("orderId", orderId);
    trackingUrl.searchParams.set("productId", productId);

    const trackingLink = `<button class="track-package-button button-secondary"><a href="${trackingUrl.toString()}" class="track-package-link">Track Package</a></button>`;

    let orderedProducts = ``;

    const foundProduct = getProduct(product.productId);
    if (foundProduct) {
      const delivDate = dayjs(product.estimatedDeliveryTime);
      const delivDateFormat = delivDate.format("MMMM D");

      orderedProducts += `<div class="product-image-container">
            <img src="${foundProduct.image}" />
            </div>
            
            <div class="product-details">
              <div class="product-name">
                ${foundProduct.name}
                </div>
              <div class="product-delivery-date">Arriving on: ${delivDateFormat} </div>
              <div class="product-quantity">Quantity: ${product.quantity}</div>
              <button class="buy-again-button button-primary js-buy-again"
              data-product-id="${product.productId}"
              data-product-quantity="${product.quantity}"><a class="buy-again-link" href="./checkout.html">
              <img class="buy-again-icon" src="images/icons/buy-again.png" />
              <span class="buy-again-message">Buy it again</span>
              </a>
              </button>
              </div>
              
              <div class="product-actions">
              ${trackingLink}
              </div>
              `;

      orderDetails += `<div class="order-details-grid js-order-details-grid">${orderedProducts}</div>`;

      // <a href="/checkout.html" class="buy-again-link">
      // </a>
    }
  });

  const ordersGrid = document.querySelector(".js-orders-grid");

  if (ordersGrid) {
    ordersGrid.innerHTML = orderDetails;
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelector(".js-orders-grid").innerHTML = orderDetails;
    });
  }
});

function renderBuyAgainCart(productId) {
  const cartTwo = [];
  console.log(productId);
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      cartTwo.push(cartItem);
    }
  });
  console.log(cartTwo);
  return cartTwo;
}

function attachBuyAgainListeners() {
  const buyAgainButtons = document.querySelectorAll(".js-buy-again");
  if (buyAgainButtons) {
    buyAgainButtons.forEach((button, index) => {
      const productId = button.dataset.productId;
      const quantity = Number(button.dataset.productQuantity);
      if (!productId) {
        console.error(`Button at ${index} is missing a data-product-id`);
        console.log("Button HTML:", button.outerHTML);
        return;
      }

      const newButton = button.cloneNode(true);
      button.replaceWith(newButton);
      newButton.addEventListener("click", () => {
        const repurchasedProductId = newButton.dataset.productId;
        if (newButton) {
          reAddToCart(repurchasedProductId, quantity);
          const newCart = renderBuyAgainCart(repurchasedProductId);
          setCart(newCart);
          updateCartQuantity();
          saveToStorage();
          console.log(cart);
        } else {
          console.error("Product ID not found for this button");
        }
      });
    });
  }
}

/*


    if (buyAgainButtons) {
       console.log(buyAgainButtons);
      document.addEventListener("DOMContentLoaded", () => {
        console.log('DOM LOADED');
    });
  }


  */

attachBuyAgainListeners();
