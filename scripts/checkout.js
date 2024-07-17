import {cart, removeFromCart, updateDeliveryOption} from '../data/cart.js';
import {products} from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import {deliveryOptions} from '../data/deliveryOptions.js'

const today = dayjs();
let deliveryDate = today.add(7, 'days');
console.log(deliveryDate.format('dddd, MMMM D'));

let cartSummary='';

cart.forEach((cartItem, index)=>{
    let cItem;
    console.log(cart.length);
    products.forEach((pItem)=>{
        if(cartItem.productId === pItem.id){
            cItem = pItem;
        } 
    });

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
        if(option.id===deliveryOptionId) deliveryOption = option;
    });

    const today = dayjs();
    const deliveryDate = today.add(
        deliveryOption.deliveryDays, 'days'
    );
    const dateString = deliveryDate.format('dddd, MMMM D');



    cartSummary += `<div class="cart-item-container js-cart-item-container-${cItem.id}">
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
                $${(cItem.priceCents/100).toFixed(2)}
                </div>
                <div class="product-quantity">
                <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary">
                    Update
                </span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${cItem.id}">
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

function deliveryOptionsHTML(id, cartItem){
    let html = ''
    deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(
            deliveryOption.deliveryDays, 'days'
        );
        const dateString = deliveryDate.format('dddd, MMMM D');
        const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${(deliveryOption.priceCents / 100).toFixed(2)} -`;

        const isChecked = deliveryOption.id===cartItem.deliveryOptionId;

        html += `<div class="delivery-option js-delivery-option" data-product-id = "${id}" data-delivery-option-id = "${deliveryOption.id}">
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
        </div>`
    });
    return html;
}

document.querySelector('.js-checkout').innerHTML = cartSummary;

document.querySelectorAll('.js-delete-link').forEach((link)=>{
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        console.log(container);
        container.remove();
    });
});

document.querySelectorAll('.js-delivery-option').forEach((element)=>{
    element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
    });
});

