import {cart, loadFromStorage} from '../../data/cart.js'; 


export function checkoutQuantity() {
loadFromStorage();
let cartQuantity = 0;
cart.forEach( (cartProduct) => {
   cartQuantity += cartProduct.quantity;
});

document.querySelector('.js-checkout-qty').innerText = cartQuantity;

return cartQuantity;
}
