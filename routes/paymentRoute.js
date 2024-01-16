const express = require('express');
const router = express.Router();
const {
  handleWebhook,
  processRefund,
  checkoutProcess, // Assuming the checkout function is included in your payment controller
} = require('../controllers/paymentController');

// Handle webhook events from Stripe

router.post('/webhook',express.raw({type: 'application/json'}), handleWebhook);

// Process refund for an order
router.post('/refund', processRefund);

// Process checkout/payment
router.post('/checkout', checkoutProcess);

module.exports = router;
