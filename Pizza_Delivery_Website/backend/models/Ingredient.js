const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true, default: 'kg' },
  minStock: { type: Number, required: true, default: 20 },
  lastRestocked: { type: Date, default: Date.now },
  supplier: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Ingredient', ingredientSchema);
