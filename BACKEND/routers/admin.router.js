import express from "express";
import upload from "../middlware/multer.middlware.js";

import { authMiddleware,isAdmin } from "../middlware/admin.auth.js";
import { registerAdmin,loginAdmin,addProduct,getProduct,deleteProduct, adminLogout,orderDetail } from "../controllers/admin.controller.js";
const router = express.Router();

// Register admin (temporary route - disable after first use)
router.post("/register", registerAdmin);
// Login admin
router.post("/adminlogin", loginAdmin);


router.post("/addproduct",upload.array("images", 4),authMiddleware, isAdmin,addProduct)
 router.get ("/getproduct",authMiddleware, isAdmin, getProduct)
router.delete('/getproducts/:id',authMiddleware, isAdmin, deleteProduct)
router.get("/orderdetails-admin",authMiddleware,isAdmin, orderDetail)
router.post("/logout",authMiddleware, adminLogout)
export default router;