const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const {userId} = req.body; // Assuming user ID is available in req.user.id after authentication
    
    const cart = await Cart.findOne({ user: userId }).populate('products.product', '-updatedAt -createdAt');
    
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    // Check if the product exists in the database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);

    if (existingProductIndex !== -1) {
      // Increase the quantity if the product is already in the cart
      cart.products[existingProductIndex].quantity += quantity || 1;
    } else {
      // Add the product to the cart if it's not already there
      cart.products.push({ product: productId, quantity: quantity || 1 });
    }

    // Save the updated cart to the database
    await cart.save();

    return res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

    if (productIndex !== -1) {
      // Found the product in the cart
      const productInCart = cart.products[productIndex];

      if (productInCart.quantity > 1) {
        // Decrease quantity if more than 1
        productInCart.quantity -= 1;
      } else {
        // Remove the product if quantity is 1
        cart.products.splice(productIndex, 1);
      }

      await cart.save();

      return res.status(200).json({ message: 'Product removed from cart successfully' });
    } else {
      // Product not found in the cart
      return res.status(404).json({ message: 'Product not found in the cart' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// Clear user's cart
const clearCart = async (req, res) => {
  try {
    const {userId} = req.body;

    await Cart.findOneAndDelete({ user: userId });

    return res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
};
