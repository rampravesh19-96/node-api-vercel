const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // Existing fields
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    imageURL: String,
    // Additional field for indicating if a product is featured
    isFeatured: {
        type: Boolean,
        default: false // Assuming most products won't be featured by default
    },
    // Other fields as needed
}, { timestamps: true });


// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
