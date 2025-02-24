import mongoose from "mongoose";

    const productSchema = new mongoose.Schema({
        images: {
          type: [String], // Array of image URLs
          validate: {
            validator: function(arr) {
              return arr.length <= 4; // Max 4 images allowed
            },
            message: 'Maximum 4 images allowed'
          },
          default: [] 
        },
        name: {
          type: String,
          required: true,
          trim: true
        },
        sizes: {
          S: { type: Boolean, default: false }, // Toggleable sizes
          M: { type: Boolean, default: false },
          XL: { type: Boolean, default: false },
          XXL: { type: Boolean, default: false }
        },
        price: {
          type: Number,
          required: true,
          min: 0
        },
        details: {
          type: String,
          required: true
        },
        category: {
          type: String,
          required: true,
          enum: ["kids","women","men"] 
        }
      }, { timestamps: true });
      
      

export default mongoose.model('Product', productSchema);
