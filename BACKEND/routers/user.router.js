import express from "express";
import { authMiddleware } from "../middlware/user.auth.js";
import { userSignup,userLogin,productView,getProductDetails,getMyOrders,addToCart,addProductToCart,removeProductFromCart,logout,checkout,verifyPayment } from "../controllers/user.controller.js";

const router = express.Router();
router.post("/usersignup",userSignup)
router.post("/userlogin", userLogin)
router.get ("/", authMiddleware,productView)
router.get("/:id",  authMiddleware,getProductDetails);
router.get("/myorders",  authMiddleware, getMyOrders);
router.post("/cart",  authMiddleware, addToCart);
router.post("/cart/add/:productId",  authMiddleware, addProductToCart);
router.post("/cart/delete/:productId", authMiddleware, removeProductFromCart);
 router.post("/checkout", authMiddleware, checkout);
 router.post("/checkout/verify-payment", authMiddleware, verifyPayment);
router.post("/logout", authMiddleware, logout);

export default router;