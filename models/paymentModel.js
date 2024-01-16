const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentIntentId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true, 
  },
  status: {
    type: String, // 'success' or 'failure'
    required: true,
  },
  error: {
    type: String, // Only for failed payments
  },
  // Add more fields as needed
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
