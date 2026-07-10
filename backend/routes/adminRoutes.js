import express from "express";
import {
  getUsers,
  getUserById,
  toggleBlock,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  addProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats, // ✅ Add this
} from "../controllers/adminController.js";

import { getProducts } from "../controllers/productController.js";
import adminProtect from "../middleware/adminAuth.js";

const router = express.Router();


router.get("/dashboard", adminProtect, getDashboardStats);


router.get("/users", adminProtect, getUsers);
router.get("/users/:id", adminProtect, getUserById);
router.patch("/users/:id/block", adminProtect, toggleBlock);
router.delete("/users/:id", adminProtect, deleteUser);


router.get("/orders", adminProtect, getAllOrders);
router.patch("/orders/:id/status", adminProtect, updateOrderStatus);


router.get("/products", adminProtect, getProducts);
router.post("/products", adminProtect, addProduct);
router.put("/products/:id", adminProtect, updateProduct);
router.patch("/products/:id", adminProtect, updateProduct);
router.delete("/products/:id", adminProtect, deleteProduct);

export default router;