import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/Adminlogin.jsx";
import AdminDashboard from "./pages/Admindashboard.jsx";
import AdminAddProduct from "./pages/AdminAddProduct.jsx";
import AdminOrderList from "./pages/AdminOrderList.jsx";
import AdminProductList from "./pages/AdminProductList.jsx";
import UserHome from "./pages/UserHome.jsx";
import UserSignup from "./pages/UserSignup.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import MyOrders from "./pages/UserMyOrders.jsx";
import UserCart from "./pages/UserCart.jsx";
import UserViewProduct from "./pages/UserViewProduct.jsx";
import CheckoutBilling from "./pages/UserCheckout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import AllProductsPage from "./pages/UserAllproduct.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/adminlogin" element={<AdminLogin />} />
      
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/addproduct" element= {<AdminAddProduct />} />
        <Route path="/getproduct" element= {<AdminProductList />} />
        <Route path="/orderdetails-admin" element= {< AdminOrderList/>} />

        <Route path ="/" element={<UserHome />} />
        <Route path ="/usersignup" element={<UserSignup />} />
        <Route path ="/userlogin" element={<UserLogin />} />
        
        <Route path ="/usercart" element={<UserCart />} />
        <Route path="/productdetails/:productId" element={<UserViewProduct/>} />
        <Route path="/billing" element={<CheckoutBilling />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/allproduct" element={<AllProductsPage/>} />
      
      </Routes>
    </Router>
  );
}

export default App;
