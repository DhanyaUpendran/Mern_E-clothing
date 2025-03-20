import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/user/userlogin", formData, {
        withCredentials: true, // To store cookies if needed
      });

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
      }).then(() => {
        // Store user info (optional)
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Add this line to store the token
        localStorage.setItem("token", response.data.token);
        // Redirect to dashboard or home page
        navigate("/");
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-green-800 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-green-100 rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 bg-gradient-to-br text-black from-green-400 to-green-800 p-8 flex flex-col justify-center">
          <div className="text-center md:text-left">
            <h3 className=" text-2xl font-bold mb-4">Welcome to Our Platform</h3>
            <p className=" mb-6">
              Create an account to access all features and begin your experience with us.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center bg-green-400 rounded-full w-10 h-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6  bg-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-4 text-black">Easy account management</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center  bg-green-400 rounded-full w-10 h-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6  bg-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="ml-4 text-black">Secure authentication</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center  bg-green-400 rounded-full w-10 h-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 bg-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="ml-4 text-black">Fast and reliable service</span>
              </div>
            </div>
          </div>
        </div>
       {/* Right side - Image/Content */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Login to Explore</h2>
            <p className="text-gray-600">Join us today and start your purchase today</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Choose a username"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Create a password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-800 text-black py-3 rounded-lg hover:bg-green-400 transition duration-300 font-medium shadow-md"
            >
              {loading ? "Processing..." : "Login"}
            </button>
          </form>
          
          <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
            <button
              onClick={() => navigate("/usersignup")}
              className="text-green-600 font-medium hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
export default UserLogin;
