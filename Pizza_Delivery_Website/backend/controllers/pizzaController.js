const asyncHandler = require('express-async-handler');
const Pizza = require('../models/Pizza');

// Get a list of all available pizzas
const getPizzas = asyncHandler(async (req, res) => {
  const pizzas = await Pizza.find({ available: true });
  res.json(pizzas);
});

// Get a single pizza by ID
const getPizzaById = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findById(req.params.id);
  if (!pizza) {
    return res.status(404).json({ message: 'Pizza not found' });
  }
  res.json(pizza);
});

// Create a new pizza (admin only)
const createPizza = asyncHandler(async (req, res) => {
  const { name, description, price, image, category, sizes, available } = req.body;

  if (!name || !description || !price || !image) {
    return res.status(400).json({ message: 'Name, description, price and image are required.' });
  }

  const pizza = await Pizza.create({
    name,
    description,
    price,
    image,
    category: category || 'classic',
    sizes: Array.isArray(sizes) ? sizes : [],
    available: available !== undefined ? available : true,
  });

  res.status(201).json({ message: 'Pizza created successfully.', pizza });
});

// Update an existing pizza (admin only)
const updatePizza = asyncHandler(async (req, res) => {
  const { name, description, price, image, category, sizes, available } = req.body;
  const pizza = await Pizza.findById(req.params.id);

  if (!pizza) {
    return res.status(404).json({ message: 'Pizza not found' });
  }

  pizza.name = name ?? pizza.name;
  pizza.description = description ?? pizza.description;
  pizza.price = price ?? pizza.price;
  pizza.image = image ?? pizza.image;
  pizza.category = category ?? pizza.category;
  pizza.sizes = Array.isArray(sizes) ? sizes : pizza.sizes;
  pizza.available = available !== undefined ? available : pizza.available;

  const updatedPizza = await pizza.save();
  res.json({ message: 'Pizza updated successfully.', pizza: updatedPizza });
});

// Delete a pizza (admin only)
const deletePizza = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findById(req.params.id);
  if (!pizza) {
    return res.status(404).json({ message: 'Pizza not found' });
  }

  await pizza.deleteOne();
  res.json({ message: 'Pizza deleted successfully.' });
});

module.exports = { getPizzas, getPizzaById, createPizza, updatePizza, deletePizza };
