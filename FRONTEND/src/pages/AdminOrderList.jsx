import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminOrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          navigate("/adminlogin");
          return;
        }

        const response = await axios.get("http://localhost:3000/admin/orderdetails-admin", {
          // headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error.response?.data || error.message);
        navigate("/adminlogin");
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/admin/update-status/${orderId}`,
        { orderStatus: newStatus }, // Correct payload
        { withCredentials: true } // Correct option placement
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Order List</h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="text-left">
              <th className="px-4 py-3 border">Customer</th>
              <th className="px-4 py-3 border">Products</th>
              <th className="px-4 py-3 border">Billing Details</th>
              <th className="px-4 py-3 border">Payment Method</th>
              <th className="px-4 py-3 border">Amount</th>
              <th className="px-4 py-3 border">Date</th>
              <th className="px-4 py-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} className={`border ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                {/* Customer Name */}
                <td className="px-4 py-3 border text-gray-700">
                  <strong>User name:</strong> {order.user?.username}
                  <br />
                  <strong>ID:</strong> {order.user?._id?.toString()}
                </td>

                {/* Product Details */}
                <td className="px-4 py-3 border">
                  {order.products.map((product) => (
                    <div key={product.productId?._id || `temp-${Math.random()}`} className="flex items-center space-x-3 text-gray-600 text-sm">
                    {product.productId && product.productId.images?.length > 0 ? (
                      <img 
                        src={product.productId.images[0]} 
                        alt={product.productId.name || "Product"} 
                        className="w-12 h-12 object-cover rounded" 
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                
                    <div>
                      <span className="font-medium">
                        {product.productId ? product.productId.name : 'Product Not Available'}
                      </span> 
                      ({product.quantity || 0} × ${product.productId ? product.productId.price?.toFixed(2) || '0.00' : '0.00'})
                    </div>
                  </div>
                ))}
                 
                </td>

                {/* Billing Details */}
                <td className="px-4 py-3 border text-gray-600 text-sm">
                  <span className="font-medium text-gray-800">Name:</span> {order.billingDetails.firstName} {order.billingDetails.lastName}
                  <br />
                  <span className="font-medium text-gray-800">Address:</span> {order.billingDetails.address}, {order.billingDetails.city}
                  <br />
                  <span className="font-medium text-gray-800">Postal Code:</span> {order.billingDetails.postalCode}
                  <br />
                  <span className="font-medium text-gray-800">Country:</span> {order.billingDetails.country}
                  <br />
                  <span className="font-medium text-gray-800">Phone:</span> {order.billingDetails.phone}
                </td>

                {/* Payment Method */}
                <td className="px-4 py-3 border text-gray-700">
                  {order.paymentDetails.method}{" "}
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      order.paymentDetails.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.paymentDetails.status}
                  </span>
                </td>

                {/* Total Amount */}
                <td className="px-4 py-3 border font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</td>

                {/* Order Date */}
                <td className="px-4 py-3 border text-gray-600">{new Date(order.date).toLocaleDateString()}</td>

                {/* Order Status Dropdown */}
                <td className="px-4 py-3 border">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="block w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  >
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
    </div>
  );
};

export default AdminOrderList;
