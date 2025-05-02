import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Navbar = () => {
  const navigate = useNavigate();

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem("token"); // Assuming the token is stored in localStorage
  };

  

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/userlogout`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.removeItem("token"); // Remove token from localStorage
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been successfully logged out!",
        });
        navigate("/userlogin"); // Redirect to login page
      }
    } catch (error) {
      console.error("Logout failed:", error);
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "Something went wrong. Try again!",
      });
    }
  };

  return (
    <div>
      <div className="navbar bg-[#46291E] shadow-sm text-white">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            
          </div>
          <a className="btn btn-ghost text-xl" onClick={() => navigate("/")}>
            HOME
          </a>
        </div>
       
        <div className="navbar-end">
         
          <a className="btn ml-2" onClick={handleLogout}>
            LOGOUT
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
