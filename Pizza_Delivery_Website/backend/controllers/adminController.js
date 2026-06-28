const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Pizza = require('../models/Pizza');

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email phone')
    .populate('items.pizza', 'name category price')
    .sort({ createdAt: -1 });
  res.json(orders);
});

const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
  const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const paidOrders = await Order.countDocuments({ paymentStatus: 'paid' });
  const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  res.json({
    totalOrders,
    confirmedOrders,
    deliveredOrders,
    pendingOrders,
    paidOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  if (status && ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'].includes(status)) {
    order.status = status;
  }

  if (paymentStatus && ['pending', 'paid', 'failed'].includes(paymentStatus)) {
    order.paymentStatus = paymentStatus;
  }

  await order.save();
  res.json({ message: 'Order updated successfully.', order });
});

const getInventory = asyncHandler(async (req, res) => {
  const pizzas = await Pizza.find().select('name price category available quantity');
  res.json(pizzas);
});

const addPizza = asyncHandler(async (req, res) => {
  const { name, description, price, image, category } = req.body;

  if (!name || !description || !price || !image) {
    return res.status(400).json({ message: 'All pizza fields are required.' });
  }

  const pizza = await Pizza.create({
    name,
    description,
    price,
    image,
    category: category || 'classic',
  });

  res.status(201).json({ message: 'Pizza added successfully.', pizza });
});

const updatePizza = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findById(req.params.id);

  if (!pizza) {
    return res.status(404).json({ message: 'Pizza not found.' });
  }

  Object.assign(pizza, req.body);
  await pizza.save();
  res.json({ message: 'Pizza updated successfully.', pizza });
});

const deletePizza = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findByIdAndDelete(req.params.id);

  if (!pizza) {
    return res.status(404).json({ message: 'Pizza not found.' });
  }

  res.json({ message: 'Pizza deleted successfully.' });
});

module.exports = { getOrders, getOrderStats, updateOrderStatus, getInventory, addPizza, updatePizza, deletePizza };
