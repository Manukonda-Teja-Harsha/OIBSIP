const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAllIngredients,
  getIngredientById,
  addIngredient,
  updateIngredient,
  deleteIngredient,
  getLowStockIngredients,
  triggerLowStockAlert,
} = require('../controllers/inventoryController');

// Public read-only routes (can be accessed by authenticated users)
router.get('/', protect, getAllIngredients);
router.get('/:id', protect, getIngredientById);
router.get('/status/low-stock', protect, getLowStockIngredients);

// Admin-only routes
router.post('/', protect, admin, addIngredient);
router.put('/:id', protect, admin, updateIngredient);
router.delete('/:id', protect, admin, deleteIngredient);

// Manual trigger for alert (admin only)
router.post('/alert/trigger', protect, admin, triggerLowStockAlert);

module.exports = router;
