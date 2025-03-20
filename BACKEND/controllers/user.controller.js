import User from "../models/user.signup.js"
import Cart from "../models/user.cart.js"
import Product from "../models/admin.addproduct.model.js"
import Order from "../models/user.order.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from 'crypto';

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
              if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
                
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
                
                   sameSite: "Lax",
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
            const page = parseInt(req.query.page) || 1;  
            const limit = parseInt(req.query.limit) || 3; 
            const skip = (page - 1) * limit;
    
            // console.log("Fetching products... Page:", page, "Limit:", limit); // Debugging
    
            const products = await Product.find().select('-__v').skip(skip).limit(limit);
            const totalProducts = await Product.countDocuments();
    
            res.json({
                products,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
            });
        } catch (error) {
            console.error("Error in productView:", error); // Debugging
            res.status(500).json({ error: 'Server error', details: error.message });
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

 
  // 3️⃣ Add Item to Cart
  export const addToCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;
  
      if (!productId) {
        return res.status(400).json({ success: false, message: "Invalid product ID" });
      }
  
      // Check if the product exists
      const productExists = await Product.findById(productId);
      if (!productExists) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({ user: userId, products: [] });
      }
  
      // Check if product is already in cart
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
  
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
  
      await cart.save();
      res.json({ success: true, cart });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ success: false, message: "Error adding to cart" });
    }
  };
  
//getcart

export const getCart = async (req, res) => {
  try {
    console.log("User ID:", req.user.id);
    const userCheck = await User.findById(req.user.id);
    if (!userCheck) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cart = await Cart.findOne({ user: req.user.id }).populate("products.productId");

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Filter out any products where productId is null
    cart.products = cart.products.filter(p => p.productId !== null);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

  // 4️⃣ Add Specific Product to Cart
export const addProductToCart = async (req, res) => {
    req.body.productId = req.params.productId;
    return addToCart(req, res);
  };
  //update cart quantity

  export const updatequantity = async (req,res) =>{
    try {
      const { itemId, quantity } = req.body;
      const userId = req.user.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized: Please log in." });
      }
  
      if (quantity < 1) {
        return res.status(400).json({ error: "Quantity must be at least 1." });
      }
  
      // Find the user's cart
      let cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({ error: "Cart not found." });
      }
  
      // Find the product in the cart
      let productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === itemId
      );
  
      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found in cart." });
      }
  
      // Update quantity
      cart.products[productIndex].quantity = quantity;
      await cart.save();
  
      return res.json({ message: "Quantity updated successfully", cart });
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      return res.status(500).json({ error: "Internal server error." });
    }}
  
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
      const { billingDetails } = req.body;
      const cart = await Cart.findOne({ user: userId }).populate("products.productId");
  
      if (!cart || cart.products.length === 0) return res.status(400).json({ message: "Cart is empty" });
  
      const totalAmount = cart.products.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, // Convert to paisa
        currency: "INR",
        receipt: `order_${Date.now()}`,
      });

      res.json({ success: true, order: razorpayOrder, billingDetails });
    } catch (error) {
      res.status(500).json({ message: "Error initiating payment", error });
    }
  };
  

  // 7️⃣ Verify Payment & Save Order
  export const verifyPayment = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, billingDetails } = req.body;
      // console.log("Request body:", req.body);
      // console.log("User object:", req.user);
      
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      
      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ message: "Payment verification failed" });
      }
      
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const userId = req.user._id;
      const cart = await Cart.findOne({ user: userId }).populate("products.productId");
      
      if (!cart) return res.status(400).json({ message: "No cart found" });
      
      // Format billing details to match your schema
      const formattedBillingDetails = {
        firstName: billingDetails.firstName,
        lastName: billingDetails.lastName,
        address: billingDetails.address,
        city: billingDetails.city,
        postalCode: billingDetails.zip, // Map zip to postalCode
        country: billingDetails.state, // Map state to country or add state field
        phone: billingDetails.phone,
      };
      
      const newOrder = new Order({
        user: userId,
        products: cart.products.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        })),
        totalAmount: cart.products.reduce((sum, item) => sum + item.productId.price * item.quantity, 0),
        billingDetails: formattedBillingDetails,
        paymentDetails: {
          method: "Razorpay",
          status: "paid", // lowercase to match enum
          paymentId: razorpay_payment_id,
        },
        status: "pending", // Use a value from your enum
      });
      
      // console.log("Saving order:", {
      //   user: userId,
      //   products: newOrder.products.length,
      //   totalAmount: newOrder.totalAmount,
      // });
      
      await newOrder.save();
      await Cart.findOneAndDelete({ user: userId });
      
      res.json({ success: true, message: "Payment successful, order placed" });
    } catch (error) {
      console.error("Error details:", error);
      res.status(500).json({ message: "Error verifying payment", error: error.message });
    }
  };
  //get orders

  export const getOrders = async (req, res) => {
    try {
      // console.log("User ID:", req.user); // Debugging line
  
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user data" });
      }
  
      const userId = req.user._id;
  
      const orders = await Order.find({ user: userId })
        .populate("products.productId", "name price images")
        .sort({ date: -1 });
  
      if (!orders.length) {
        return res.status(404).json({ message: "No orders found" });
      }
  
      res.json({ success: true, orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
  };
  
  //get all product page 
 
export const getALLProduct = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    
    // Add search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }
    
    // Add category filter
    if (category) {
      query.category = category;
    }
    
    const products = await Product.find(query)
      .select('-__v') // Exclude version key
      .sort({ createdAt: -1 }); // Sort by newest first
      
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get product categories (helper API)
export const getCategories = async (req, res) => {
  try {
    // Get distinct categories from products collection
    const categories = await Product.distinct('category');
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


 

  
  // 8️⃣ Logout
export const userlogout = (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.json({ success: true, message: "Logged out successfully" });
  };
