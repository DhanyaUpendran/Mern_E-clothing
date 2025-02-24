import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig.js";
import { v4 as uuidv4 } from "uuid";

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "MERN_E-CLOTHING", // Change folder name as needed
    format: async (req, file) => "png", // Convert all images to PNG
    public_id: (req, file) => uuidv4(), // Generate unique filename
  },
});

// Multer middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

export default upload;
