import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/admindashboard", { withCredentials: true });

        if (response.status !== 200) {
          navigate("/adminlogin");
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        navigate("/adminlogin");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:3000/admin/logout", {}, { withCredentials: true });

      if (response.status === 200) {
        navigate("/adminlogin");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="h-screen bg-gray-100 p-6">
      {/* Logout Button */}
      <button onClick={handleLogout} className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-md">
        Logout
      </button>

      {/* Dashboard Heading */}
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Add Product Card */}
        <div
          className="bg-white shadow-lg p-6 rounded-lg text-center cursor-pointer hover:bg-blue-100"
          onClick={() => navigate("/addproduct")}
        >
          <h2 className="text-xl font-semibold">➕ Add Product</h2>
        </div>

        {/* Product List Card */}
        <div
          className="bg-white shadow-lg p-6 rounded-lg text-center cursor-pointer hover:bg-green-100"
          onClick={() => navigate("/getproduct")}
        >
          <h2 className="text-xl font-semibold">📦 Product List</h2>
        </div>

        {/* Order Details Card */}
        <div
          className="bg-white shadow-lg p-6 rounded-lg text-center cursor-pointer hover:bg-yellow-100"
          onClick={() => navigate("/orderdetails-admin")}
        >
          <h2 className="text-xl font-semibold">📜 Order Details</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
