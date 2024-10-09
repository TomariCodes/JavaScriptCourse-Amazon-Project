import {
  getProduct,
  loadProductsFetch,
} from "../data/products.js";
import {
  getDeliveryOption
} from "../../data/deliveryOptions.js";
import { formatCurrency } from "../scripts/utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
export const orders = JSON.parse(localStorage.getItem("orders")) || [];

await loadProductsFetch();

console.log(orders);

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
    let orderedProducts = ``;
    
    const foundProduct = getProduct(product.productId);
    if (foundProduct) {
      // console.log(foundProduct);
       // const delivDate = getDeliveryOption(foundProduct);
      // console.log(delivDate);
      // const estimatedDeliveryDate = orderDate.add(delivDate.deliveryDays, "days");
      // const estimatedDeliveryDateFormat = estimatedDeliveryDate.format("MMMM D");
       const estimatedDeliveryDate = dayjs(product.estimatedDeliveryDate);
       const estimatedDeliveryDateFormat = estimatedDeliveryDate.format('MMMM D')


      orderedProducts += `<div class="product-image-container">
            <img src="${foundProduct.image}" />
            </div>
            
            <div class="product-details">
              <div class="product-name">
                ${foundProduct.name}
                </div>
              <div class="product-delivery-date">Arriving on: ${estimatedDeliveryDateFormat} </div>
              <div class="product-quantity">Quantity: ${product.quantity}</div>
              <button class="buy-again-button button-primary">
              <img class="buy-again-icon" src="images/icons/buy-again.png" />
              <span class="buy-again-message">Buy it again</span>
              </button>
              </div>
              
              <div class="product-actions">
              <a href="tracking.html">
                <button class="track-package-button button-secondary">
                Track package
                </button>
                </a>
                </div>
                `;

      orderDetails += `<div class="order-details-grid js-order-details-grid">${orderedProducts}</div>`;
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
