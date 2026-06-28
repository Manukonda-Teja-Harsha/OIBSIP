const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      pizza: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
      name: String,
      size: String,
      quantity: Number,
      price: Number,
    }
  ],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    phone: String,
  },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['razorpay', 'cash'], default: 'razorpay' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'], default: 'pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
