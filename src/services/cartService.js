// Mock cart data
let cartItems = [];

export async function getCartItems() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(cartItems);
    }, 300);
  });
}

export async function addToCart(product) {
  return new Promise(resolve => {
    setTimeout(() => {
      const existingItem = cartItems.find(item => item._id === product._id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          ...product,
          quantity: 1
        });
      }
      
      resolve({ success: true, cartItems });
    }, 300);
  });
}

export async function removeFromCart(productId) {
  return new Promise(resolve => {
    setTimeout(() => {
      cartItems = cartItems.filter(item => item._id !== productId);
      resolve({ success: true, cartItems });
    }, 300);
  });
}

export async function updateQuantity(productId, quantity) {
  return new Promise(resolve => {
    setTimeout(() => {
      const item = cartItems.find(item => item._id === productId);
      if (item) {
        item.quantity = quantity;
      }
      resolve({ success: true, cartItems });
    }, 300);
  });
}

export async function clearCart() {
  return new Promise(resolve => {
    setTimeout(() => {
      cartItems = [];
      resolve({ success: true });
    }, 300);
  });
}