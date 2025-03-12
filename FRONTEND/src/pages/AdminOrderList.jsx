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
        setOrders(response.data.orders || []);  // an array


      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        // navigate("/adminlogin");
      }
    };

    checkAuthAndFetchOrderDetails();
  }, [navigate]);
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/admin/update-status/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
    }
  };
  return (
    <div className="container">
    <h2>Admin Order List</h2>
    <table border="1">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Products</th>
          <th>Billing Details</th>
          <th>Payment Method</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => 
        (
          <tr key={order._id}>
            <td>{order.user?.firstName} {order.user?.lastName}</td>
            <td>
              {order.products.map(product => (
                <div key={product.productId._id}>
                  {product.productId.name} ({product.quantity} x ${product.productId.price})
                </div>
              ))}
            </td>
            <td>{order.billingDetails.address}, {order.billingDetails.city}</td>
            <td>{order.paymentDetails.method} ({order.paymentDetails.status})</td>
            <td>${order.totalAmount}</td>
            <td>{new Date(order.date).toLocaleDateString()}</td>
            <td>
              <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};


export default AdminOrderList
