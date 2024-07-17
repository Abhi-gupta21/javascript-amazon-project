
export let cart = JSON.parse(localStorage.getItem('cart'));
if(!cart){
  cart = [{
    productId: "3fdfe8d6-9a15-4979-b459-585b0d0545b9",
    quantity: 2,
    deliveryOptionId: '2'
  }]
}


function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId){
    let matchingItem;
  
    cart.forEach((cartItem) => {
      if(productId === cartItem.productId){
        matchingItem = cartItem;
      }
    });
  
    if(matchingItem){
      matchingItem.quantity++;
    }else{
      cart.push({
        productId: productId,  
        quantity: 1,
        deliveryOptionId: '1'
      });
    }
    saveToStorage();
  }

export function removeFromCart(id){
  const newCart=[];

  cart.forEach((cartItem)=>{
    if(cartItem.productId !== id){
      newCart.push(cartItem);
    }
  });


  cart = newCart;

  saveToStorage();
}




export function updateDeliveryOption(productId, deliveryOptionId){
  let matchingItem;
  cart.forEach((cartItem) => {
    if(cartItem.id === productId) matchingItem = cartItem;
  });
  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}