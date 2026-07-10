import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId })
      .populate("products.productId");
    if (!cart) return res.json({ products: [] });
    res.json({ products: cart.products });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addToCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const existing = await Cart.findOne({
      userId: req.userId,
      "products.productId": productId,
    });
    if (existing) return res.status(400).json({ message: "Already in cart" });

    await Cart.findOneAndUpdate(
      { userId: req.userId },
      { $push: { products: { productId, quantity: 1 } } },
      { upsert: true }
    );

    res.json({ message: "Added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    await Cart.findOneAndUpdate(
      { userId: req.userId },
      { $pull: { products: { productId } } }
    );
    res.json({ message: "Removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  try {
    await Cart.findOneAndUpdate(
      { userId: req.userId, "products.productId": productId },
      { $set: { "products.$.quantity": quantity } }
    );
    res.json({ message: "Quantity updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.userId },
      { $set: { products: [] } }
    );
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};