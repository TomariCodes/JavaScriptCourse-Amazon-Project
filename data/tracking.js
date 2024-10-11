import { loadProductsFetch, getProduct } from "./products.js";
import { orders } from "./orders.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

const url = new URL(window.location.href);
console.log(url.searchParams.get("orderId"));
const urlOrderId = url.searchParams.get("orderId");
console.log(url.searchParams.get("productId"));
const urlProduct = url.searchParams.get("productId");

await loadProductsFetch();

orders.forEach((order) => {
  if (order.id === urlOrderId) {
    const entireOrder = order.products;

    entireOrder.forEach((product) => {
      if ((product.productId = urlProduct)) {
        const productInfo = getProduct(product.productId);
        console.log(productInfo);

        const arrivialDate = dayjs(product.estimatedDeliveryTime);
        console.log(arrivialDate);
        const arrivingOn = arrivialDate.format("dddd, MMMM D");
        console.log(arrivingOn);
        let trackingHTML = ``;

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

        return trackingHTML;
      }
    });
  }
});
