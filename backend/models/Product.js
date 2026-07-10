import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  brand:   { type: String, required: true },
  price:   { type: Number, required: true },
  purpose: { type: String },
  image:   { type: String },
  active:  { type: Boolean, default: true },
  stock:   { type: Number, default: 0 },
  specs: {
    CPU:     String,
    GPU:     String,
    RAM:     String,
    Storage: String,
    Display: String,
    Battery: String,
    OS:      String,
  },
});

export default mongoose.model("Product", productSchema); 