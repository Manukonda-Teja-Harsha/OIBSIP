const asyncHandler = require('express-async-handler');
const Ingredient = require('../models/Ingredient');
const { sendLowStockAlert } = require('../utils/emailService');

/**
 * Get all ingredients with stock levels
 */
const getAllIngredients = asyncHandler(async (req, res) => {
  const ingredients = await Ingredient.find().sort({ quantity: 1 });
  
  const stats = {
    totalIngredients: ingredients.length,
    lowStockCount: ingredients.filter(i => i.quantity < i.minStock).length,
    ingredients
  };

  res.json(stats);
});

/**
 * Get a single ingredient by ID
 */
const getIngredientById = asyncHandler(async (req, res) => {
  const ingredient = await Ingredient.findById(req.params.id);
  
  if (!ingredient) {
    return res.status(404).json({ message: 'Ingredient not found' });
  }

  res.json(ingredient);
});

/**
 * Add a new ingredient
 */
const addIngredient = asyncHandler(async (req, res) => {
  const { name, quantity, unit, minStock, supplier } = req.body;

  // Validation
  if (!name || quantity === undefined || !unit) {
    return res.status(400).json({ message: 'Please provide name, quantity, and unit' });
  }

  // Check if ingredient already exists
  const exists = await Ingredient.findOne({ name: name.toLowerCase() });
  if (exists) {
    return res.status(400).json({ message: 'Ingredient already exists' });
  }

  const ingredient = new Ingredient({
    name: name.toLowerCase(),
    quantity,
    unit,
    minStock: minStock || 20,
    supplier: supplier || '',
    lastRestocked: new Date(),
  });

  await ingredient.save();
  res.status(201).json(ingredient);
});

/**
 * Update ingredient quantity (restock)
 */
const updateIngredient = asyncHandler(async (req, res) => {
  const { quantity, minStock, supplier } = req.body;
  
  const ingredient = await Ingredient.findById(req.params.id);
  if (!ingredient) {
    return res.status(404).json({ message: 'Ingredient not found' });
  }

  // Update fields
  if (quantity !== undefined) ingredient.quantity = quantity;
  if (minStock !== undefined) ingredient.minStock = minStock;
  if (supplier !== undefined) ingredient.supplier = supplier;
  ingredient.lastRestocked = new Date();

  await ingredient.save();
  res.json(ingredient);
});

/**
 * Delete an ingredient
 */
const deleteIngredient = asyncHandler(async (req, res) => {
  const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
  
  if (!ingredient) {
    return res.status(404).json({ message: 'Ingredient not found' });
  }

  res.json({ message: 'Ingredient deleted', ingredient });
});

/**
 * Get low stock ingredients (manual trigger)
 */
const getLowStockIngredients = asyncHandler(async (req, res) => {
  const lowStock = await Ingredient.find({ quantity: { $lt: 20 } });
  res.json({ count: lowStock.length, ingredients: lowStock });
});

/**
 * Manually trigger low stock alert email
 */
const triggerLowStockAlert = asyncHandler(async (req, res) => {
  const lowStock = await Ingredient.find({ quantity: { $lt: 20 } });

  if (lowStock.length === 0) {
    return res.json({ message: 'No low stock ingredients found' });
  }

  await sendLowStockAlert(lowStock);
  res.json({ 
    message: 'Low stock alert email sent', 
    alertedCount: lowStock.length,
    ingredients: lowStock.map(i => i.name)
  });
});

module.exports = {
  getAllIngredients,
  getIngredientById,
  addIngredient,
  updateIngredient,
  deleteIngredient,
  getLowStockIngredients,
  triggerLowStockAlert,
};
