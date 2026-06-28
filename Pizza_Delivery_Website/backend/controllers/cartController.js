const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Pizza = require('../models/Pizza');

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.pizza', 'name image price');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [], totalPrice: 0 });
  }
  res.json(cart);
});

const addToCart = asyncHandler(async (req, res) => {
  const { pizzaId, size, quantity } = req.body;
  if (!pizzaId || !size || !quantity) {
    return res.status(400).json({ message: 'Pizza ID, size, and quantity are required.' });
  }

  const pizza = await Pizza.findById(pizzaId);
  if (!pizza) {
    return res.status(404).json({ message: 'Pizza not found.' });
  }

  const cart = await Cart.findOne({ user: req.user._id }) || new Cart({ user: req.user._id, items: [] });
  const existingItem = cart.items.find((item) => item.pizza.toString() === pizzaId && item.size === size);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      pizza: pizza._id,
      name: pizza.name,
      size,
      quantity,
      price: pizza.price,
      image: pizza.image,
    });
  }

  cart.totalPrice = calculateTotal(cart.items);
  await cart.save();
  res.status(200).json(cart);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1.' });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found.' });
  }

  const item = cart.items.id(itemId);
  if (!item) {
    return res.status(404).json({ message: 'Cart item not found.' });
  }

  item.quantity = quantity;
  cart.totalPrice = calculateTotal(cart.items);
  await cart.save();
  res.json(cart);
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found.' });
  }

  const item = cart.items.id(itemId);
  if (!item) {
    return res.status(404).json({ message: 'Cart item not found.' });
  }

  item.remove();
  cart.totalPrice = calculateTotal(cart.items);
  await cart.save();
  res.json(cart);
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
