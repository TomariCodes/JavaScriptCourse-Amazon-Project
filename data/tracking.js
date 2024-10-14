import { loadProductsFetch, getProduct } from "./products.js";
import { orders } from "./orders.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

const urlParams = new URLSearchParams(window.location.search);

const urlOrderId = urlParams.get("orderId");
console.log(urlOrderId);
const urlProduct = urlParams.get("productId");

await loadProductsFetch();
let trackingHTML = ``;

orders.forEach((order) => {
  if (order.id === urlOrderId) {
    const entireOrder = order.products;
    entireOrder.forEach((product) => {
      if (product.productId === urlProduct && order.id === urlOrderId) {
        console.log(product);
        const productInfo = getProduct(product.productId);
        console.log(productInfo);
        const arrivalDate = dayjs(product.estimatedDeliveryTime);
        const arrivingOn = arrivalDate.format("dddd, MMMM D");

        

        trackingHTML = ` <div class="delivery-date">
            Arriving on ${arrivingOn}
            </div>

        <div class="product-info">
        ${productInfo.name}
        </div>
        
        <div class="product-info">
        Quantity: ${product.quantity}
        </div>

        <img class="product-image" src=${productInfo.image}>`;

        }});
    }});

  
  
    document.querySelector('.js-product-inserts').innerHTML = trackingHTML;
