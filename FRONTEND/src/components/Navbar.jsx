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
        "http://localhost:3000/user/userlogout",
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
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl" onClick={() => navigate("/usersignup")}>
            SIGN UP
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li onClick={() => navigate("/userorder")}>
              <a>MY ORDERS</a>
            </li>
            <li onClick={() => navigate("/userproduct")}>
              <a>ALL PRODUCTS</a>
            </li>
            <li onClick={() => navigate("/usercart")}>
              <a>CART</a>
            </li>
          </ul>
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
