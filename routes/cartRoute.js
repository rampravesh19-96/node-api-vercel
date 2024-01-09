const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

// GET user's cart
router.get('/cart', getCart);

// POST add product to cart
router.post('/cart/add', addToCart);

// DELETE remove product from cart
router.delete('/cart/remove', removeFromCart);

// DELETE clear user's cart
router.delete('/cart/clear', clearCart);

module.exports = router;
