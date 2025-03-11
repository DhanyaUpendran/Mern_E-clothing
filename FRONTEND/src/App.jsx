import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/Adminlogin.jsx";
import AdminDashboard from "./pages/Admindashboard.jsx";
import AdminAddProduct from "./pages/AdminAddProduct.jsx";
import AdminOrderList from "./pages/AdminOrderList.jsx";
import AdminProductList from "./pages/AdminProductList.jsx";
import UserHome from "./pages/UserHome.jsx";



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
      
      </Routes>
    </Router>
  );
}

export default App;
