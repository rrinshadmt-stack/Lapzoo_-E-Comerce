import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    address, city, state, pincode, phone,
  } = req.body;

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const cart = await Cart.findOne({ userId: req.userId })
      .populate("products.productId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    for (const item of cart.products) {
      const product = item.productId;
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    const subtotal = cart.products.reduce((sum, i) => sum + i.productId.price * i.quantity, 0);
    const tax = subtotal * 0.12;
    const total = subtotal + 100 + tax;

    await Order.create({
      userId: req.userId,
      products: cart.products.map((i) => ({
        productId: i.productId._id,
        quantity: i.quantity,
      })),
      totalAmount: total,
      address, city, state, pincode, phone,
      paymentId: razorpay_payment_id,
      status: "Pending",
    });

    await Cart.findOneAndUpdate(
      { userId: req.userId },
      { $set: { products: [] } }
    );

    res.json({ message: "Payment verified and order placed" });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate("products.productId")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ _id: orderId, userId: req.userId })
      .populate("products.productId");

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: item.quantity },
      });
    }

    await Order.findByIdAndUpdate(orderId, { $set: { status: "Cancelled" } });

    res.json({ message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};