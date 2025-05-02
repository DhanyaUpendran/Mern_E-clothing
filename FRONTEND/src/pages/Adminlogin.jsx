import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


// import Cookies from "js-cookie";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/adminlogin`,
        { username, password },
        { withCredentials: true } 
      );
      if (response.status !== 200) {
        throw new Error(response.data.message || "Login failed");
      }
  
      if (response.data.isAdmin) {
        localStorage.setItem("adminToken", response.data.token);
        console.log("Admin Authenticated, Navigating...");
        navigate("/admindashboard"); // Redirect on success
      } else {
        throw new Error("Admin access required.");
      }
  
    } catch (error) {
      console.error("Login Error:", error.message);
      setError("Login Failed: " + error.message);
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
