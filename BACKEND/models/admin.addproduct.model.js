import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { 
    type: String, 
    required: true,
    enum: ["kids", "women", "men"] 
  },
  images: { type: [String], required: true },
  sizes: {
    S: Boolean,
    M: Boolean,
    XL: Boolean,
    XXL: Boolean,
  },
  details: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);