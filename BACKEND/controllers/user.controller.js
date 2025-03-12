import User from "../models/user.signup.js"
import Cart from "../models/user.cart.js"
import Product from "../models/admin.addproduct.model.js"
import Order from "../models/user.order.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });



export const userSignup = async (req,res)=>{
    try{
     const {phone,username,password} = req.body;
     const existinguser = await User.findOne({ username });
           if (existinguser) {
             return res.status(400).json({ message: "user already exists" });
           }
            // Hash password (using bcrypt)
                 const salt = await bcrypt.genSalt(10);
                 const hashedPassword = await bcrypt.hash(password, salt);
                  // Create user
                       const user = new User({
                         phone,
                         username,
                         password: hashedPassword,
                        
                       });
                   
                       await user.save();
                       res.status(201).json({ message: "user created successfully" });
             

    }catch (error){
    
        console.error("Registration Error:", error);
        console.error("Error Cause:", error.cause); // Log the root cause
        res.status(500).json({ 
          error: "Failed to create admin",
          details: error.message,
           stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        });}}

    
        export const userLogin = async (req, res) => {
            try {
              const { username, password } = req.body;
          
              // Validate input
              if (!username || !password) {
                return res.status(400).json({ message: "Username and password are required" });
              }
          
              // Find user with case-insensitive username search
              const user = await User.findOne({ 
                username: { $regex: new RegExp(`^${username}$`, 'i') }
              }).select('+password');
          
              // Generic error message to prevent user enumeration
              if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: "Invalid credentials" });
              }
          
              // Generate JWT token
              const token = jwt.sign(
                { 
                  id: user._id,
                  role: user.role // Add additional claims if needed
                },
                process.env.JWT_SECRET_USER,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
              );
          
              // Set HTTP-only cookie (optional but recommended)
              res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000 // 1 hour
              });
          
              // Return response without sensitive data
              res.status(200).json({
                success: true,
                user: {
                  id: user._id,
                  username: user.username,
                  role: user.role
                }
              });
          
            } catch (error) {
              
              console.error('Login error:', error);
              
              
              res.status(500).json({ 
                success: false,
                message: "Authentication failed. Please try again later."
              });
            }
          };



       // product View 


       export const productView = async (req, res) => {
        try {
          const page = parseInt(req.query.page) || 1;  // Default to page 1
          const limit = parseInt(req.query.limit) || 3; // Default to 6 items per page
          const skip = (page - 1) * limit;
      
          // Fetch products with pagination
          const products = await Product.find().select('-__v').skip(skip).limit(limit);
          const totalProducts = await Product.countDocuments(); // Total product count
      
          res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
          });
        } catch (error) {
          res.status(500).json({ error: 'Server error' });
        }
      };
      
    
    //get product details

    export const getProductDetails = async (req, res) => {
        try {
          const product = await Product.findById(req.params.id);
          if (!product) return res.status(404).json({ message: "Product not found" });
          res.json({ success: true, product });
        } catch (error) {
          res.status(500).json({ message: "Error fetching product details", error });
        }
      };

      // 2️⃣ Get User Orders
export const getMyOrders = async (req, res) => {
    try {
      const userId = req.user.id; // Extracted from JWT
      const orders = await Order.find({ user: userId }).select('-__v'); // Fetch orders of logged-in user
      res.json({ success: true, orders });
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders", error });
    }
  };
  // 3️⃣ Add Item to Cart
export const addToCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.id;
  
      let cart = await Cart.findOne({ user: userId });
      if (!cart) cart = new Cart({ user: userId, products: [] });
  
      const productExists = cart.products.find((p) => p.productId.toString() === productId);
      if (productExists) {
        productExists.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
  
      await cart.save();
      res.json({ success: true, message: "Added to cart" });
    } catch (error) {
      res.status(500).json({ message: "Error adding to cart", error });
    }
  };
  // 4️⃣ Add Specific Product to Cart
export const addProductToCart = async (req, res) => {
    req.body.productId = req.params.productId;
    return addToCart(req, res);
  };
  // 5️⃣ Remove Product from Cart
export const removeProductFromCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
  
      let cart = await Cart.findOne({ user: userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      cart.products = cart.products.filter((p) => p.productId.toString() !== productId);
      await cart.save();
  
      res.json({ success: true, message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Error removing from cart", error });
    }
  };
  // 6️⃣ Checkout - Create Razorpay Order
export const checkout = async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await Cart.findOne({ user: userId }).populate("products.productId");
  
      if (!cart || cart.products.length === 0) return res.status(400).json({ message: "Cart is empty" });
  
      const totalAmount = cart.products.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, // Convert to paisa
        currency: "INR",
        receipt: `order_${Date.now()}`,
      });
  
      res.json({ success: true, order: razorpayOrder });
    } catch (error) {
      res.status(500).json({ message: "Error initiating payment", error });
    }
  };
  
  // 7️⃣ Verify Payment & Save Order
  export const verifyPayment = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
  
      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ message: "Payment verification failed" });
      }
  
      const userId = req.user.id;
      const cart = await Cart.findOne({ user: userId }).populate("products.productId");
  
      if (!cart) return res.status(400).json({ message: "No cart found" });
  
      const newOrder = new Order({
        user: userId,
        products: cart.products.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        })),
        totalAmount: cart.products.reduce((sum, item) => sum + item.productId.price * item.quantity, 0),
        paymentDetails: {
          method: "Razorpay",
          status: "Paid",
          paymentId: razorpay_payment_id,
        },
        status: "Processing",
      });
  
      await newOrder.save();
      await Cart.findOneAndDelete({ user: userId });
  
      res.json({ success: true, message: "Payment successful, order placed" });
    } catch (error) {
      res.status(500).json({ message: "Error verifying payment", error });
    }
  };
  
  // 8️⃣ Logout
export const userlogout = (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.json({ success: true, message: "Logged out successfully" });
  };
