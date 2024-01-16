const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch the user's cart
    const cart = await Cart.findOne({ user: userId }).populate('products.product');

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: 'No products in the cart' });
    }

    // Extract products and calculate total amount
    const products = cart.products.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
    }));
    const totalAmount = calculateTotalAmount(cart.products);

    // Create a new order
    const newOrder = new Order({
      user: userId,
      products,
      totalAmount,
      // Additional order details can be added here
    });

    // Save the new order
    const createdOrder = await newOrder.save();

    // Optionally, clear the user's cart after the order is created
    cart.products = [];
    await cart.save();

    return res.status(201).json({ order: createdOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const calculateTotalAmount = (products) => {
  // Calculate total amount from the products array
  return products.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// Fetch all orders for a user
const getAllOrdersForUser = async (req, res) => {
  try {
    const {userId} = req.body; // Assuming user ID is available in req.user.id after authentication

    const orders = await Order.find({ user: userId }).populate(
      "products.product",
      "-updatedAt -createdAt"
    );

    return res.status(200).json({ orders });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId).populate(
      "products.product",
      "-updatedAt -createdAt"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not founddd" });
    }

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  createOrder,
  getAllOrdersForUser,
  getOrderById,
};
