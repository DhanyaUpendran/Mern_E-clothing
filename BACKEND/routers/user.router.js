import express from "express";
import { authMiddleware } from "../middlware/user.auth.js";
import { userSignup,userLogin,productView,getProductDetails,getMyOrders,addToCart,addProductToCart,removeProductFromCart,updatequantity,userlogout,checkout,verifyPayment, getCart } from "../controllers/user.controller.js";

const router = express.Router();
router.post("/usersignup",userSignup)
router.post("/userlogin", userLogin)
router.get ("/",productView)
router.get("/:id",authMiddleware,getProductDetails);
router.get("/myorders",  authMiddleware, getMyOrders);
router.get("/getcart",authMiddleware,getCart)
router.post("/cart",authMiddleware, addToCart);
router.post("/cart/add/:productId",  authMiddleware, addProductToCart);
router.post("/cart/delete/:productId", authMiddleware, removeProductFromCart);
router.put ("/cart/update",authMiddleware,updatequantity)
 router.post("/checkout", authMiddleware, checkout);
 router.post("/checkout/verify-payment", authMiddleware, verifyPayment);
router.post("/userlogout", authMiddleware, userlogout);

export default router;