import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity:  { type: Number, default: 1 },
  }],
  totalAmount:  { type: Number },
  address:      { type: String },
  city:         { type: String },
  state:        { type: String },
  pincode:      { type: String },
  phone:        { type: String },
  paymentId:    { type: String },
  status:       { type: String, default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);