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

// Initialize express before any potential errors
const app = express();
dotenv.config();

// Basic middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-e-clothing-sfhb.vercel.app"
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

// Wrap routes in try/catch to prevent crashes
try {
  // Import routes after express is initialized
  const connectToMongoDB = (await import("./db/connectToMongoDB.js")).default;
  const adminRoute = (await import("./routers/admin.router.js")).default;
  const userRoute = (await import("./routers/user.router.js")).default;
  
  // API routes
  app.use("/admin", adminRoute);
  app.use("/user", userRoute);
  
  // Getting razorpay key for frontend
  app.get("/get-razorpay-key", (req, res) => {
    try {
      res.json({ key: process.env.RAZORPAY_KEY_ID || "RAZORPAY_KEY_NOT_SET" });
    } catch (err) {
      console.error("Error in razorpay route:", err);
      res.status(500).json({ error: 'Error processing razorpay key request' });
    }
  });
  
  // Try to connect to MongoDB but don't crash if it fails
  try {
    await connectToMongoDB();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    // Add a route to check MongoDB status
    app.get("/api/db-status", (req, res) => {
      res.status(500).json({ 
        error: 'MongoDB connection failed',
        message: error.message
      });
    });
  }
} catch (err) {
  console.error("Error during server initialization:", err);
  // Add fallback route if imports fail
  app.get("/", (req, res) => {
    res.status(500).json({ 
      error: 'Server initialization error',
      message: err.message
    });
  });
}

// Catch-all route for debugging
app.get("*", (req, res) => {
  res.status(404).json({ 
    message: "Route not found", 
    path: req.path,
    method: req.method
  });
});

// Error handling middleware - must be last
app.use((err, req, res, next) => {
  console.error("Express error handler caught:", err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    path: req.path
  });
});

// Export for Vercel
export default app;