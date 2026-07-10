import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.userId })
      .populate("products");
    if (!wishlist) return res.json({ products: [] });
    res.json({ products: wishlist.products });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    const existing = await Wishlist.findOne({
      userId: req.userId,
      products: productId,
    });
    if (existing) return res.status(400).json({ message: "Already in wishlist" });

    await Wishlist.findOneAndUpdate(
      { userId: req.userId },
      { $push: { products: productId } },
      { upsert: true }
    );

    res.json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  try {
    await Wishlist.findOneAndUpdate(
      { userId: req.userId },
      { $pull: { products: productId } }
    );
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};