import { loadFromStorage, cart, loadCart } from "./cart.js";
import {Product, products, loadProducts, getProduct, loadProductsFetch} from '../data/products.js'
import { formatCurrency } from "../scripts/utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
export const orders = JSON.parse(localStorage.getItem('orders')) || [];

await loadProductsFetch();

export function addOrder(order) {
orders.unshift(order);
saveToStorage();
};

function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

let orderDetails = ``;


orders.forEach((order) => {
  const orderDate = dayjs(order.orderTime);
  const orderDateFormat = orderDate.format('MMMM M');

  orderDetails = `<div class="order-container-${order.id}">
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
              </div>
              
              <div class="order-details-grid js-order-details-grid">`;
  
  order.products.forEach((product) => {
  const estimatedDeliveryDate = dayjs(product.estimatedDeliveryDate);
  const estimatedDeliveryDateFormat = estimatedDeliveryDate.format('MMMM M');

  const foundProduct = getProduct(product.productId);
  let orderedProducts = ``;
  if (foundProduct) {
    orderedProducts = `<div class="product-image-container">
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
                </div>`; 
                
                } 
  });

});

