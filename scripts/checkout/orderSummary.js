import { cart as cartData, removeFromCart, updateDeliveryOption } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

const today = dayjs();
let deliveryDate = today.add(7, 'days');
console.log(deliveryDate.format('dddd, MMMM D'));

export function renderOrderSummary() {
    let cartSummary = '';

    cartData.forEach((cartItem) => {
        let cItem = getProduct(cartItem.productId);
        

        const deliveryOptionId = cartItem.deliveryOptionId;

        let deliveryOption = getDeliveryOption(deliveryOptionId);

        deliveryOptions.forEach((option) => {
            if (option.id === deliveryOptionId) deliveryOption = option;
        });

        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        cartSummary += `<div class="cart-item-container js-cart-item-container-${cartItem.productId}">
            <div class="delivery-date">
            Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
            <img class="product-image"
                src="${cItem.image}">

            <div class="cart-item-details">
                <div class="product-name">
                ${cItem.name}
                </div>
                <div class="product-price">
                $${(cItem.priceCents / 100).toFixed(2)}
                </div>
                <div class="product-quantity">
                <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary">
                    Update
                </span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${cartItem.productId}">
                    Delete
                </span>
                </div>
            </div>

            <div class="delivery-options">
                <div class="delivery-options-title">
                Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(cItem.id, cartItem)}
            </div>
        </div>
    </div>`;
    });

    document.querySelector('.js-checkout').innerHTML = cartSummary;

    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);

            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            if (container) {
                container.remove();
            }
        });
    });

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const productId = element.dataset.productId;
            const deliveryOptionId = element.dataset.deliveryOptionId;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
}

function deliveryOptionsHTML(id, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');
        const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${(deliveryOption.priceCents / 100).toFixed(2)} -`;

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        html += `<div class="delivery-option js-delivery-option" data-product-id="${id}" data-delivery-option-id="${deliveryOption.id}">
            <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input"
                name="delivery-option-${id}">
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


