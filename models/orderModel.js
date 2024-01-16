const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  // Other order details as needed
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

// {
//   userId : {type:String,required:true},
//   customerId : {type:String},
//   paymentIntentId : {type:String},
//   products : [
//     id : {type : String},
//     name : {type : String},
//     brand : {type : String},
//     desc : {type : String},
//     price : {type : String},
//     image : {type : String},
//     cartQuantity : {type : String},
//   ],
//   subtotal : {type : Number, required:true},
//   total : {type : Number, required:true},
//   shipping : {type : Object, required:true},
//   total : {type : Number, required:true},
//   delivery_status : {type : String, required:true},
//   payment_status : {type : String, required:true},
//   total : {type : Number, required:true},
//   total : {type : Number, required:true},

// }
