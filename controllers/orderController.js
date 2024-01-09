const Order = require("../models/orderModel");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user.id after authentication
    const { products, totalAmount } = req.body;

    const newOrder = new Order({
      user: userId,
      products,
      totalAmount,
      // Additional order details can be added here
    });

    const createdOrder = await newOrder.save();

    return res.status(201).json({ order: createdOrder });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch all orders for a user
const getAllOrdersForUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user.id after authentication

    const orders = await Order.find({ user: userId }).populate(
      "products.product",
      "-updatedAt -createdAt"
    );

    return res.status(200).json({ orders });
  } catch (error) {
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
      return res.status(404).json({ message: "Order not found" });
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
