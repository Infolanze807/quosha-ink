import { CartItem } from "../../types/cart";
import { Product } from "../../types/product";

// Function to get cart items from local storage
const getCartItems = (): CartItem[] => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

// Function to update cart items in local storage
const updateCartItems = (cartItems: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(cartItems));
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  localStorage.setItem('totalQuantity', totalQuantity.toString());
};

const addToCart = async (cartItem: CartItem) => {
  const cartItems = getCartItems();
  const itemIndex = cartItems.findIndex(item => item.product.id === cartItem.product.id);
  if (itemIndex >= 0) {
    cartItems[itemIndex].quantity += 1;
  } else {
    cartItems.push({ ...cartItem, quantity: 1 });
  }
  updateCartItems(cartItems);
  return cartItem;
};

const removeItemFromCart = async (id: number) => {
  const cartItems = getCartItems();
  const updatedCart = cartItems.filter(item => item.product.id !== id);
  updateCartItems(updatedCart);
  return id;
};

const reduceItemFromCart = async (cartItem: Product) => {
  const cartItems = getCartItems();
  const itemIndex = cartItems.findIndex(item => item.product.id === cartItem.id);
  if (itemIndex >= 0) {
    if (cartItems[itemIndex].quantity > 1) {
      cartItems[itemIndex].quantity -= 1;
    } else {
      cartItems.splice(itemIndex, 1);
    }
  }
  updateCartItems(cartItems);
  return cartItem;
};

const incrementItemFromCart = async (cartItem: Product) => {
  const cartItems = getCartItems();
  const itemIndex = cartItems.findIndex(item => item.product.id === cartItem.id);
  if (itemIndex >= 0) {
    cartItems[itemIndex].quantity += 1;
  }
  updateCartItems(cartItems);
  return cartItem;
};

const cartService = {
  addToCart,
  removeItemFromCart,
  reduceItemFromCart,
  incrementItemFromCart,
};

export default cartService;
