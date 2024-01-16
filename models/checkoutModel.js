const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  // Other fields related to checkout details
}, { timestamps: true });

const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;
