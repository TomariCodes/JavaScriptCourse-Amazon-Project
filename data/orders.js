import { loadFromStorage, cart, loadCart } from "./cart.js";
import {products, loadProducts, getProduct} from '../data/products.js'
export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
orders.unshift(order);
saveToStorage();
};

function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

console.log(orders);






