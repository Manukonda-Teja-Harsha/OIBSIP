const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, default: 'classic' },
  sizes: [{ label: String, multiplier: Number }],
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Pizza', pizzaSchema);
