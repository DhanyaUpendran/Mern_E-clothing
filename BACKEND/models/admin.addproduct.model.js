import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  images: { type: [String], required: true },
  sizes: {
    S: Boolean,
    M: Boolean,
    XL: Boolean,
    XXL: Boolean,
  },
  details: { type: String, required: true },
        category: {
          type: String,
          required: true,
          enum: ["kids","women","men"] 
        }
      }, { timestamps: true });
      
      

export default mongoose.model('Product', productSchema);
