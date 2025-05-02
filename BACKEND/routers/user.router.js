import express from "express";
import { authMiddleware } from "../middlware/user.auth.js";
import { userSignup,userLogin,productView,getProductDetails,addToCart,addProductToCart,removeProductFromCart,updatequantity,userlogout,checkout,verifyPayment, getCart,getOrders, getALLProduct, getCategories } from "../controllers/user.controller.js";

const router = express.Router();
router.post("/usersignup",userSignup)
router.post("/userlogin", userLogin)
router.get ("/",productView)
router.get("/getcart",authMiddleware,getCart)

router.get("/orders", authMiddleware, getOrders); // Get all orders
router.get("/products",authMiddleware,getALLProduct) //product showing page
router.get("/products/categories",authMiddleware,getCategories)
router.post("/cart",authMiddleware, addToCart);
router.post("/cart/add/:productId",  authMiddleware, addProductToCart);
router.post("/cart/delete/:productId", authMiddleware, removeProductFromCart);
router.put ("/cart/update",authMiddleware,updatequantity)

 router.post("/checkout", authMiddleware, checkout);
 router.post("/checkout/verify-payment", authMiddleware, verifyPayment);
 

 router.get("/:id",authMiddleware,getProductDetails);


router.post("/userlogout", authMiddleware, userlogout);

router.get("/get-razorpay-key", (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID});
  });
  

export default router;