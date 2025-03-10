import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        console.log("Checking auth with token:", token);

        const response = await axios.get("http://localhost:3000/admin/getproduct", {
          // headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        console.log("Auth check response:", response.data);

        if (response.status !== 200) {
          navigate("/adminlogin");
        }
      } catch (error) {
        console.error("Authentication failed:", error.response?.data || error.message);
        navigate("/adminlogin");
      }
    };

    checkAuth();
  }, [navigate]);


  return (
    <div>
      
    </div>
  )
}

export default AdminProductList
