import React, { useState, useEffect } from 'react';
import { FaTimes, FaBars, FaShoppingCart, FaSignOutAlt, FaUser, FaBoxOpen, FaPhone, FaTshirt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [cartCount, setCartCount] = useState(0); // Cart item count
  const navigate = useNavigate();


  useEffect(() => {
    fetchCartCount(); // Fetch cart items on load
  }, []);
  const fetchCartCount = async () => {
    try {
      const response = await axios.post('http://localhost:3000/user/cart', { productId, quantity },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      if (response.data.success) {
        const totalQuantity = response.data.cart.products.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalQuantity);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };



  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/user/logout',
        {},
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Clear client-side storage
        localStorage.removeItem('userData');
        sessionStorage.removeItem('sessionData');
        // Redirect after short delay
        setTimeout(() => navigate('/login'), 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Logout failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoggingOut(false);
    }
  };

  
    return (
      <div className="w-full bg-base-200">
        
        <div className="navbar max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo / Brand Name */}
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <FaTshirt className="text-primary" /> Cloth Side
          </Link>
  
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            <Link to="/about" className="btn btn-ghost">
              <FaUser className="mr-2" /> About Us
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              <FaPhone className="mr-2" /> Contact
            </Link>
            <Link to="/cart" className="btn btn-ghost relative">
              <FaShoppingCart className="mr-2" /> Cart
              {cartCount > 0 && (
                <span className="badge badge-error absolute top-0 right-0">{cartCount}</span>
              )}
            </Link>
            <Link to="/my-orders" className="btn btn-ghost">
              <FaBoxOpen className="mr-2" /> My Orders
            </Link>
            <Link to="/products" className="btn btn-ghost">
              🛍️ Products
            </Link>
          </div>
  
          {/* Logout Button */}
          <div className="hidden md:flex">
            <button 
              onClick={handleLogout}
              className="btn btn-error"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Logging out...
                </>
              ) : (
                <>
                  <FaSignOutAlt className="mr-2" /> Logout
                </>
              )}
            </button>
          </div>
  
          {/* Mobile Menu Toggle */}
          <button className="md:hidden btn btn-square btn-ghost" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
  
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-base-100 shadow-lg rounded-lg p-4 flex flex-col items-center gap-4">
            <Link to="/about" className="btn btn-ghost w-full">
              <FaUser className="mr-2" /> About Us
            </Link>
            <Link to="/contact" className="btn btn-ghost w-full">
              <FaPhone className="mr-2" /> Contact
            </Link>
            <Link to="/cart" className="btn btn-ghost w-full relative">
              <FaShoppingCart className="mr-2" /> Cart
              {cartCount > 0 && <span className="badge badge-error absolute top-0 right-0">{cartCount}</span>}
            </Link>
            <Link to="/my-orders" className="btn btn-ghost w-full">
              <FaBoxOpen className="mr-2" /> My Orders
            </Link>
            <Link to="/products" className="btn btn-ghost w-full">
              🛍️ Products
            </Link>
  
            {/* Mobile Logout Button */}
            <button 
              onClick={handleLogout}
              className="btn btn-error w-full"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Logging out...
                </>
              ) : (
                <>
                  <FaSignOutAlt className="mr-2" /> Logout
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default Header;