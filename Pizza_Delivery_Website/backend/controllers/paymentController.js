const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const razorpay = require('../utils/razorpay');
const Order = require('../models/Order');

const createPaymentOrder = asyncHandler(async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ message: 'Payment service not configured. Please configure Razorpay credentials.' });
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required.' });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to pay for this order.' });
  }

  if (order.paymentStatus === 'paid') {
    return res.status(400).json({ message: 'Order already paid.' });
  }

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100),
      currency: 'INR',
      receipt: `order_${orderId}`,
      notes: {
        orderId: orderId.toString(),
        userId: req.user._id.toString(),
      },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment order.', error: error.message });
  }
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
    return res.status(400).json({ message: 'Missing payment verification details.' });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to verify this order.' });
  }

  // Verify signature
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    return res.status(400).json({ message: 'Invalid payment signature.' });
  }

  try {
    // Fetch payment details from Razorpay to confirm
    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    if (payment.status !== 'captured') {
      return res.status(400).json({ message: 'Payment not captured.' });
    }

    // Update order with payment details
    order.razorpayPaymentId = razorpayPaymentId;
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    await order.save();

    res.json({
      message: 'Payment verified successfully. Order confirmed.',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment verification failed.', error: error.message });
  }
});

module.exports = { createPaymentOrder, verifyPayment };
