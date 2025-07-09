// import express from "express";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import connectToMongoDB from "./db/connectToMongoDB.js";
// import adminRoute from "./routers/admin.router.js";
// import userRoute from "./routers/user.router.js";
// // import Cart from "./models/user.cart.js"
// import path from "path";
// import { fileURLToPath } from "url";
// import cors from "cors";  

// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(cookieParser());

// // Allow requests from frontend
// app.use(
//   cors({
//     origin:[ "http://localhost:5173", // 
//     "https://mern-e-clothing-sfhb.vercel.app"],

//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ['Content-Type', 'Authorization'],
  
//   })
// );

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// // Move API routes above static serving
// app.use("/admin", adminRoute);
// app.use("/user", userRoute);

// // Serve static frontend build files **after** API routes
// app.use(express.static(path.join(__dirname, "../FRONTEND/dist"))); 

// // Handle React frontend routing
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../FRONTEND/dist", "index.html"));
// });  
// //getting razorpay key for frontend
// app.get("/get-razorpay-key", (req, res) => {
//   res.json({ key: process.env.RAZORPAY_KEY_ID });
// });

// const port = process.env.PORT
// // Consider making DB connection before starting server
// const startServer = async () => {
//   try {
//     await connectToMongoDB();
//     console.log("Connected to MongoDB");
//     app.listen(3000, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   } catch (error) {
//     console.error("Failed to connect to MongoDB:", error);
//   }
// };
// startServer();

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Internal Server Error' });
// });
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-e-clothing-sfhb.vercel.app",
      "https://mern-e-clothing-sfhb-rimefua3a-dhanyas-projects-bbe37b38.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Test route that doesn't require DB connection
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// Simple root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Import other modules
import connectToMongoDB from "./db/connectToMongoDB.js";
import adminRoute from "./routers/admin.router.js";
import userRoute from "./routers/user.router.js";

// API routes
app.use("/admin", adminRoute);
app.use("/user", userRoute);

// Getting razorpay key for frontend
app.get("/get-razorpay-key", (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID || "RAZORPAY_KEY_NOT_SET" });
});

// Connect to MongoDB
try {
  await connectToMongoDB();
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export the Express app
export default app;