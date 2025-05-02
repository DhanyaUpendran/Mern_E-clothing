import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Topbar from '../components/Topbar'
const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
       
        const response = await axios.get("http://localhost:3000/user/getcart", {
          withCredentials: true, 
        });
       
        console.log("API Response:", response);
        
        // Filter out items with null productId
        const validItems = (response.data.cart.products || []).filter(
          item => item.productId !== null
        );
        
        setCartItems(validItems);
        
        // If there are null products, log a warning
        if (validItems.length < (response.data.cart.products || []).length) {
          console.warn("Some products in the cart have null productId values");
        }
  
      } catch (error) {
        console.log("Error fetching cart:", error);
        setError("Failed to load your cart. Please try again later.");
        
        if (error.response?.status === 401) {
          console.log("Got 401, about to redirect to login");
          navigate("/userlogin");
        } else {
          console.error("Error fetching cart:", error.response?.data || error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCart();
  }, [navigate]);

  // Update quantity
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(
        "http://localhost:3000/user/cart/update",
        { itemId, quantity: newQuantity },
        { withCredentials: true }
      );

      // Update local state
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId && item.productId._id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity. Please try again.");
    }
  };

  // Remove item
  const handleRemoveItem = async (productId) => {
    try {
      await axios.post(
        `http://localhost:3000/user/cart/delete/${productId}`,
        {},
        { withCredentials: true }
      );
      setCartItems(cartItems.filter((item) => 
        item.productId && item.productId._id !== productId
      ));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // Checkout
  const handleCheckout = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/user/checkout",
        {},
        { withCredentials: true }
      );
      alert(`Redirecting to payment: Order ID ${data.order.id}`);
      navigate("/billing");
      // Redirect to payment gateway here
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to checkout. Try again.");
    }
  };

  // Format price with 2 decimal places
  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-5">🛒 Your Cart</h2>
        <p className="text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-5">🛒 Your Cart</h2>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <Topbar />
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg text-black">
      <h2 className="text-2xl font-semibold mb-5 ">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate("/allproduct")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {cartItems.map((item) => {
            // Skip rendering if productId is null
            if (!item.productId) {
              return null;
            }
            
            return (
             
              <div
                key={item._id}
                className="flex items-center justify-between border-b pb-3 mb-3  text-black"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={item.productId.images && item.productId.images.length > 0 
                      ? item.productId.images[0] 
                      : '/placeholder.jpg'} 
                    alt={item.productId.name || 'Product'} 
                    className="w-16 h-16 object-cover rounded" 
                  />

                  <div>
                    <h3 className="text-lg font-medium">{item.productId.name || 'Unknown Product'}</h3>
                    <p className="text-gray-600">₹{formatPrice(item.productId.price || 0)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId._id, item.quantity - 1)
                    }
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId._id, item.quantity + 1)
                    }
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.productId._id)}
                    className="ml-2 text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center mt-5">
            <h3 className="text-xl font-semibold">
              Total: ₹
              {formatPrice(
                cartItems.reduce(
                  (total, item) => {
                    // Handle null productId or missing price
                    const price = item.productId?.price || 0;
                    return total + price * item.quantity;
                  },
                  0
                )
              )}
            </h3>
            <button
              onClick={handleCheckout}
              className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
    </div>
    
  );
};

export default Cart;