const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must include at least one item.' });
  }

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
    return res.status(400).json({ message: 'Complete shipping address is required.' });
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (total <= 0) {
    return res.status(400).json({ message: 'Invalid order total.' });
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    total,
    paymentMethod: paymentMethod || 'razorpay',
    paymentStatus: 'pending',
    status: 'pending',
  });

  // Clear cart after order is placed
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({ message: 'Order placed successfully.', order });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.pizza', 'name image price')
    .sort({ createdAt: -1 });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.pizza', 'name image price');

  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Not authorized to view this order.' });
  }

  res.json(order);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  if (status && ['pending', 'preparing', 'out-for-delivery', 'delivered'].includes(status)) {
    order.status = status;
  }

  if (paymentStatus && ['pending', 'paid', 'failed'].includes(paymentStatus)) {
    order.paymentStatus = paymentStatus;
  }

  await order.save();
  res.json({ message: 'Order updated successfully.', order });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Not authorized to cancel this order.' });
  }

  if (['delivered', 'out-for-delivery'].includes(order.status)) {
    return res.status(400).json({ message: 'Cannot cancel a delivered or out-for-delivery order.' });
  }

  order.status = 'cancelled';
  await order.save();
  res.json({ message: 'Order cancelled successfully.', order });
});

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, cancelOrder };
