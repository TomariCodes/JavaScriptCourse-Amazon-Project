import {
  cart,
  removeFromCart,
  updateCartQuantity,
  updateDeliveryOption,
  updateQuantity,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
/*import formatCurrency from './utils/money.js'*/
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let cartSummaryHTML = ``;


  cart.forEach((cartItem) => { 
    const cartItemProductId =
      typeof cartItem.productId === "object"
        ? cartItem.productId.id
        : cartItem.productId;

    if (!cartItemProductId) {
      console.error("Missing productId for cart item:", cartItem);
      return;
    }

    const matchingProduct = getProduct(cartItemProductId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `<div class="cart-item-container 
         js-cart-item-container
         js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
            Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
              src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                ${matchingProduct.name}
                </div>
                <div class="product-price">
                ${matchingProduct.getPrice()}
                </div>
                <div class="product-quantity js-product-quantity-${
                  matchingProduct.id
                }">
                <span>
                Quantity: <span class="quantity-label js-quantity-label 
                js-quantity-label-${matchingProduct.id}">${
      cartItem.quantity
    }</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" 
                  data-product-id="${matchingProduct.id}">
                    Update
                  </span>
                  <input type="number"
                  min="1"
                  max="10"
                   class="quantity-input js-quantity-input-${
                     matchingProduct.id
                   }"
                   data-product-id="${matchingProduct.id}">
                  <span class="save-quantity-link link-primary 
                  js-save-quantity-link"
                  data-product-id="${matchingProduct.id}"
                  >Save</span>
                  <span  
                  class="delete-quantity-link link-primary 
                  js-delete-link 
                  js-delete-link-${matchingProduct.id}"
                  data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
${deliveryOptionsHTML(matchingProduct, cartItem)}
</div>
                </div>
                </div>
                `;

  });

  
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");

      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += ` <div class="delivery-option js-delivery-option" 
    data-product-id="${matchingProduct.id}"
    data-delivery-option-id="${deliveryOption.id}">
                  <input type="radio" ${isChecked ? "checked" : ""}
                  class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                    <div class="delivery-option-date">
                    ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString} Shipping
                    </div>
                  </div>
                </div>`;
    });
    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-update-link').forEach((updateLink) => {
const updatedProduct = updateLink.dataset.productId;
    updateLink.addEventListener('click', () => {
 document
   .querySelector(`.js-cart-item-container-${updatedProduct}`).classList.add("is-editing-quantity");

    });
  });

  document.querySelectorAll(".js-save-quantity-link").forEach((saveLink) => {
  const savedProduct = saveLink.dataset.productId;
  saveLink.addEventListener("click", () => {
const newQuantity = Number(document.querySelector(`.js-quantity-input-${savedProduct}`).value);
    document
      .querySelector(`.js-cart-item-container-${savedProduct}`).classList.remove("is-editing-quantity");

      document.querySelector(`.js-quantity-label-${savedProduct}`).innerText = newQuantity;
      updateQuantity(savedProduct, newQuantity);
      renderOrderSummary();
      renderPaymentSummary();
    });
});

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();

      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
