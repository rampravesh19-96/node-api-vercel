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
router.post('/cart', addToCart);

// DELETE remove product from cart
router.delete('/cart', removeFromCart);

// DELETE clear user's cart
router.delete('/carts', clearCart);

module.exports = router;
