import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminOrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]); // Correct useState initialization
  useEffect(() => {
    const checkAuthAndFetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        console.log("Checking auth with token:", token);

        const response = await axios.get("http://localhost:3000/admin/orderdetails-admin", {
          // headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        console.log("Auth check response:", response.data);

        if (response.status !== 200) {
          navigate("/adminlogin");
        }
     
      
        // Fetching products
        const productResponse = await axios.get("http://localhost:3000/admin/orderdetails-admin", {
          withCredentials: true,
        });

        console.log("Fetched products:", productResponse.data);
        setProducts(productResponse.data);
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        // navigate("/adminlogin");
      }
    };

    checkAuthAndFetchOrderDetails();
  }, [navigate]);
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.put(
        `http://localhost:3000/admin/orderdetails-admin/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        alert("Order status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating order status:", error.response?.data || error.message);
      alert("Failed to update order status!");
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Order List</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Order ID</th>
            <th className="border border-gray-300 p-2">User</th>
            <th className="border border-gray-300 p-2">Total Amount</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="border border-gray-300 p-2">{order._id}</td>
                <td className="border border-gray-300 p-2">
                  {order.user?.firstName} {order.user?.lastName}
                </td>
                <td className="border border-gray-300 p-2">${order.totalAmount.toFixed(2)}</td>
                <td className="border border-gray-300 p-2">
                  <select
                    className="p-1 border border-gray-300"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="border border-gray-300 p-2">
                  <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderList
