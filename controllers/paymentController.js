const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/orderModel");

const checkout = async (req, res) => {
  try {
    const { orderId, paymentMethodId } = req.body;

    // Fetch order details from the database
    const order = await Order.findById(orderId).populate("products.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Calculate the total amount to charge (example: sum of product prices)
    const totalAmount = order.products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe requires amount in cents
      currency: "usd", // Change currency based on your requirements
      payment_method: paymentMethodId,
      confirmation_method: "manual",
      confirm: true,
    });

    // Update the order status to 'paid' or handle confirmation as needed
    order.status = "paid"; // Assuming an order status field exists

    await order.save();

    return res
      .status(200)
      .json({ message: "Payment successful", paymentIntent });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Payment failed" });
  }
};


const handleWebhook = async (req, res) => {
  try {
    const event = req.body;

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        // Process the successful payment event and update your application
        break;
      case "payment_intent.payment_failed":
        const failedPaymentIntent = event.data.object;
        // Process the failed payment event and update your application
        break;
      // Add more cases to handle other types of events (refunds, disputes, etc.)
      default:
        return res.status(400).end();
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
};

const processRefund = async (req, res) => {
  try {
    const { orderId, amountToRefund } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
      amount: amountToRefund * 100,
    });

    // Update order status or refund details in your application

    return res
      .status(200)
      .json({ message: "Refund processed successfully", refund });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Refund processing failed" });
  }
};

// More functions...

module.exports = {
  handleWebhook,
  processRefund,
  checkout
};
