const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  pizza: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
  name: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  totalPrice: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
