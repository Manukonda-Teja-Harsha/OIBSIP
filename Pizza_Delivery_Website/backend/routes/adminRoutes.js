const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getOrders,
  getOrderStats,
  updateOrderStatus,
  getInventory,
  addPizza,
  updatePizza,
  deletePizza,
} = require('../controllers/adminController');

router.use(protect, admin);
router.get('/orders', getOrders);
router.get('/orders/stats', getOrderStats);
router.put('/orders/:id', updateOrderStatus);
router.get('/inventory', getInventory);
router.post('/pizza', addPizza);
router.put('/pizza/:id', updatePizza);
router.delete('/pizza/:id', deletePizza);

module.exports = router;
