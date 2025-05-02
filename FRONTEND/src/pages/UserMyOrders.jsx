import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistance } from 'date-fns';
import Topbar from '../components/Topbar'
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] =useState()
  const [loading ,setLoading] =useState()
 
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/user/orders', {
        withCredentials: true,
      });
      setOrders(response.data.orders);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      setLoading(false);
    }
  };


  return (
    <div>
    <Topbar />
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="border rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Order #{order._id.substring(order._id.length - 8)}
                </h2>
                <p className="text-gray-500 text-sm">
                  {new Date(order.date).toLocaleDateString()} 
                  ({formatDistance(new Date(order.date), new Date(), { addSuffix: true })})
                </p>
              </div>
              <div className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium
  ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
    order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
    order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
    'bg-red-100 text-red-800'}`}
>
  {order.status ? 
    order.status.charAt(0).toUpperCase() + order.status.slice(1) : 
    "Unknown Status"
  }
</span>

              </div>
            </div>
            
            <div className="border-t pt-4">
              {order.products.map(item => (
                <div key={item._id} className="flex items-center py-2">
                 {item.productId?.images && item.productId.images.length > 0 ? (
  <img
    src={item.productId.images[0]} 
    alt={item.productId.name}
    className="w-16 h-16 object-cover rounded"
  />
) : (
  <img
    src="/placeholder.jpg" 
    alt="Placeholder"
    className="w-16 h-16 object-cover rounded"
  />
)}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productId?.name || 'Unknown Product'}</h3>
                    <p className="text-gray-500">
                    {item.quantity} × ${item.productId?.price?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="font-medium">
                  {item.quantity} × ${item.productId?.price?.toFixed(2) || '0.00'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t mt-4 pt-4 flex justify-end">
              <div className="text-right">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium mr-8">Subtotal:</span>
                  <span>
                  ${order.products.reduce((sum, item) => 
  sum + ((item.productId?.price || 0) * item.quantity), 0).toFixed(2)
}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium mr-8">Shipping:</span>
                  <span>${order.shippingFee?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="mr-8">Total:</span>
                  <span>
                  ${(order.products.reduce((sum, item) => 
  sum + ((item.productId?.price || 0) * item.quantity), 0) + 
  (order.shippingFee || 0)).toFixed(2)
}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
</div>
  );
};

export default MyOrders;