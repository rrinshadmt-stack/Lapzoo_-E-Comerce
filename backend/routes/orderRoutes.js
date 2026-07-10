import express from "express";
import { createOrder, verifyPayment, getOrders, cancelOrder } from "../controllers/orderController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/create", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/", protect, getOrders);
router.patch("/cancel/:orderId", protect, cancelOrder);

export default router;