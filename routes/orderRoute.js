const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrdersForUser,
  getOrderById
} = require('../controllers/orderController');

// Create a new order
router.post('/orders', createOrder);

// Get all orders for a user
router.get('/orders', getAllOrdersForUser);

// Get a specific order by ID
router.get('/orders/:orderId', getOrderById);

module.exports = router;
