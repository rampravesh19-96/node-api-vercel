const Cart = require('../models/cartModel');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user.id after authentication
    
    const cart = await Cart.findOne({ user: userId }).populate('products.product', '-updatedAt -createdAt');
    
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });

    // Check if the product already exists in the cart
    const existingProduct = cart.products.find(item => item.product.toString() === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity || 1;
    } else {
      cart.products.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();

    return res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    cart.products = cart.products.filter(item => item.product.toString() !== productId);

    await cart.save();

    return res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Clear user's cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.findOneAndDelete({ user: userId });

    return res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
};
