const Order = require("../models/orderModel");
const config = require("../config.json");
const stripe = require("stripe")(config.stripe_secret_key);
const Cart = require("../models/cartModel");
const Payment = require("../models/paymentModel"); // Import the PaymentFailure model

const checkoutProcess = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "products.product",
        model: "Product",
        select: "title price imageURL",
      })
      .lean();

    const customer = await stripe.customers.create({
      metadata :{
        userId : req.body.userId,
        cart : JSON.stringify(cart.products)
      }
    })

    const lineItems = cart.products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.product.title,
          images: [product.product.imageURL],
        },
        unit_amount: Math.round(parseFloat(product.product.price) * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${config.frontend_url}/${config.pmt_success_route}`,
      cancel_url: `${config.frontend_url}/${config.pmt_cancel_route}`,
      customer:customer.id,
      line_items: lineItems,
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Example function to store information about a payment in the database
const storePayment = async (paymentIntent, status, error = null) => {
  try {
    // Save the payment information to your Payment collection
    const payment = new Payment({
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount_received,
      status,
      error,
      // Add more fields as needed
    });

    await payment.save();
    console.log(
      `Payment ${status}. Information stored in the database:`,
      payment
    );
  } catch (error) {
    console.error(`Error storing payment ${status} information:`, error);
  }
};

const createOrder = async () => {
  const Items = JSON.parse(customer.metadata.cart)
  const newOrder = Order({
    userId:customer.metadata.userId,
    sustomerId : data.customer,
    paymentIntentId : data.payment_intent,
    products : Items,
    subtotal : data.amount_subtotal,
    total : data.amount_total,
    shipping : data.customer_details,
    payment_satus: data.payment_status
  })
  try{
    const savedOrder = await newOrder.save()
    console.log("Processed order", savedOrder)
  }catch(err){
    console.log(err)
  }
}
let endpointSecret;
endpointSecret = "whsec_584a68a63e7bc55661f45833cbc966b0e0ab65754fa47b84767503f155cba692";

const handleWebhook = async(req, res) => {
  const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("verified");
    } catch (err) {
      console.log("failed",err);
  
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object
    eventType=event.type
    console.log("Event",eventType)

  // if(eventType==="checkout.session.completed"){
  //   stripe.customers.retrieve(data.customer).then((customer)=>{
  //     console.log(customer)
  //     console.log("data : ",data)
  //     // createOrder(customer,data)
  //   }).catch((err)=>{
  //     console.log(err)
  //   })
  // }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.requires_action':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      console.log("paymentIntentSucceeded",paymentIntentSucceeded)
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send().end()
}



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
  checkoutProcess,
};

//for front end
const makePayment = async()=>{
  const stripe = await loadStripe("pk_test_51N6XujSHk2fNibRL7h2z2fupJkCbyMDM4a2GOuLTzYGJLj2cuydiLjbAVDRqe8lLOD6uWr5jOLTQqEf6M55mrz1E00ZVmCQS5N");

  const body = { 
      userId:"658f203e07a1ffa4754bc77f",
      successUrl:"success",
      cancelUrl:"cancel"
    }
  const headers = {
      "Content-Type":"application/json"
  }
  const response = await fetch("http://localhost:3005/api/checkout",{
      method:"POST",
      headers:headers,
      body:JSON.stringify(body)
  });

  const session = await response.json();

  const result = stripe.redirectToCheckout({
      sessionId:session.id
  });
  
  if(result.error){
      console.log(result.error);
  }
}