const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCart, addToCart, updateCartItem, removeCartItem } = require('../controllers/cartController');

router.use(protect);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeCartItem);

module.exports = router;
