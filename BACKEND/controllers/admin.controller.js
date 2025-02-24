import Admin from "../models/admin.login.js";
import Product from "../models/admin.addproduct.model.js"
import Order from "../models/user.order.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }
  
      // Hash password (using bcrypt)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create admin
      const admin = new Admin({

        username,
        password: hashedPassword,
        isAdmin: true,
      });
  
      await admin.save();
      res.status(201).json({ message: "Admin created successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
        console.error("Error Cause:", error.cause); // Log the root cause
        res.status(500).json({ 
          error: "Failed to create admin",
          details: error.message,
           stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        });}}
//Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, isAdmin: admin.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, isAdmin: admin.isAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// adding products




export const addProduct = async (req, res) => {
  try {
    const { name, sizes, price, details, category } = req.body;

    // Extract Cloudinary image URLs from Multer
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    // Ensure at least one image was uploaded
    if (imageUrls.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required!" });
    }

    // Create new product
    const product = new Product({
      images: imageUrls, // Store multiple Cloudinary image URLs
      name,
      sizes: {
        S: sizes?.S || false,
        M: sizes?.M || false,
        XL: sizes?.XL || false,
        XXL: sizes?.XXL || false,
      },
      price,
      details,
      category,
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//product getting

export const getProduct = async (req,res)=>{
    try {
        const products = await Product.find().select('-__v'); // Exclude version key
        res.json(products);
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    }

    //delete product


    export const deleteProduct = async (req,res)=>{
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            
            if (!product) {
              return res.status(404).json({ error: 'Product not found' });
            }
      
            res.json({ message: 'Product deleted successfully' });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        
    }
    //logout

    export const adminLogout= async (req,res)=>{
        try {
            // Option 1: Clear HTTP-only cookie (if using cookies)
            res.clearCookie('token', {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
            });
        
            // Option 2: Tell client to delete token (if using localStorage)
            res.json({ message: 'Logged out successfully' });
          } catch (error) {
            res.status(500).json({ error: 'Logout failed' });
          }
    
    }
     export const orderDetail = async (req,res)=>{
        try{
            const orders = await Order.find().select('-__v'); // Exclude version key
            res.json(orders);
          } catch (error) {
            res.status(500).json({ error: 'Server error' });
          }
        }
