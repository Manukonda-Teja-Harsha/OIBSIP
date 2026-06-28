const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Pizza = require('../models/Pizza');

dotenv.config();

const pizzas = [
  {
    name: 'Classic Margherita',
    description: 'Tomato sauce, mozzarella, and basil.',
    price: 7.99,
    image: '/images/pizza-1.svg',
    category: 'Veg',
    sizes: [
      { label: 'Regular', multiplier: 1 },
      { label: 'Large', multiplier: 1.4 },
      { label: 'Family', multiplier: 1.8 },
    ],
  },
  {
    name: 'Pepperoni Feast',
    description: 'Extra pepperoni with rich cheese.',
    price: 9.99,
    image: '/images/pizza-2.svg',
    category: 'Spicy',
    sizes: [
      { label: 'Regular', multiplier: 1 },
      { label: 'Large', multiplier: 1.4 },
      { label: 'Family', multiplier: 1.8 },
    ],
  },
  {
    name: 'Supreme Deluxe',
    description: 'Pepperoni, mushrooms, onions and peppers.',
    price: 11.99,
    image: '/images/pizza-3.svg',
    category: 'Premium',
    sizes: [
      { label: 'Regular', multiplier: 1 },
      { label: 'Large', multiplier: 1.4 },
      { label: 'Family', multiplier: 1.8 },
    ],
  },
  {
    name: 'BBQ Chicken',
    description: 'Grilled chicken, BBQ sauce, onions, and cilantro.',
    price: 10.99,
    image: '/images/pizza-4.svg',
    category: 'Chicken',
    sizes: [
      { label: 'Regular', multiplier: 1 },
      { label: 'Large', multiplier: 1.4 },
      { label: 'Family', multiplier: 1.8 },
    ],
  },
  {
    name: 'Veggie Garden',
    description: 'Bell peppers, olives, mushrooms, onions and spinach.',
    price: 9.49,
    image: '/images/pizza-5.svg',
    category: 'Veg',
    sizes: [
      { label: 'Regular', multiplier: 1 },
      { label: 'Large', multiplier: 1.4 },
      { label: 'Family', multiplier: 1.8 },
    ],
  },
  {
    name: 'Hawaiian Twist',
    description: 'Ham, pineapple, melted mozzarella, and tomato sauce.',
    price: 10.49,
    image: '/images/pizza-6.svg',
    category: 'Classic',
    sizes: [
      { label: 'Regular', multiplier: 1 },
      { label: 'Large', multiplier: 1.4 },
      { label: 'Family', multiplier: 1.8 },
    ],
  },
  {
    name: 'Cheese Burst',
    description: 'Extra cheese crust with triple mozzarella goodness.',
    price: 12.49,
    image: '/images/pizza-7.svg',
    category: 'Premium',
    sizes: [
      { label: 'Regular', multiplier: 1 },
      { label: 'Large', multiplier: 1.4 },
      { label: 'Family', multiplier: 1.8 },
    ],
  },
  {
    name: 'Mexican Green Wave',
    description: 'Jalapeños, corn, bell peppers, and spicy sauce.',
    price: 10.99,
    image: '/images/pizza-8.svg',
    category: 'Spicy',
    sizes: [
      { label: 'Regular', multiplier: 1 },
      { label: 'Large', multiplier: 1.4 },
      { label: 'Family', multiplier: 1.8 },
    ],
  },
  {
    name: 'Mediterranean Delight',
    description: 'Feta, olives, red onions, tomatoes, and oregano.',
    price: 11.49,
    image: '/images/pizza-9.svg',
    category: 'Classic',
    sizes: [
      { label: 'Regular', multiplier: 1 },
      { label: 'Large', multiplier: 1.4 },
      { label: 'Family', multiplier: 1.8 },
    ],
  },
  {
    name: 'Spicy Paneer',
    description: 'Paneer, jalapeños, onions, and fiery sauce.',
    price: 10.99,
    image: '/images/pizza-10.svg',
    category: 'Veg',
    sizes: [
      { label: 'Regular', multiplier: 1 },
      { label: 'Large', multiplier: 1.4 },
      { label: 'Family', multiplier: 1.8 },
    ],
  },
  {
    name: 'Peri Peri Chicken',
    description: 'Spicy peri peri sauce, grilled chicken, and peppers.',
    price: 11.99,
    image: '/images/pizza-11.svg',
    category: 'Chicken',
    sizes: [
      { label: 'Regular', multiplier: 1 },
      { label: 'Large', multiplier: 1.4 },
      { label: 'Family', multiplier: 1.8 },
    ],
  },
  {
    name: 'Garden Herb Veg',
    description: 'Fresh basil, tomato, mushrooms, and bell peppers.',
    price: 8.99,
    image: '/images/pizza-12.svg',
    category: 'Veg',
    sizes: [
      { label: 'Regular', multiplier: 1 },
      { label: 'Large', multiplier: 1.4 },
      { label: 'Family', multiplier: 1.8 },
    ],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await User.deleteMany();
    await Pizza.deleteMany();

    const adminPassword = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@pizza.com',
      password: adminPassword,
      isAdmin: true,
      isVerified: true,
    });

    await Pizza.insertMany(pizzas);
    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
