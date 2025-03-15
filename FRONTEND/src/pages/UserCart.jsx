import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
       try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/user/getcart", {
         // headers: { Authorization: `Bearer ${token}` }, // Send token correctly
          withCredentials: true, // Ensure cookies are sent if using cookies
        });
  
        console.log("Fetched Cart:", response.data);
        setCartItems(response.data.cart.products || []); // Ensure data structure
  
      } catch (error) {
        console.error("Error fetching cart:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          navigate("/userlogin"); // Redirect unauthorized users
        }
      }
    };
  
    fetchCart();
  }, []);
  
  


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
          item.productId._id === itemId
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
      setCartItems(cartItems.filter((item) => item.productId._id !== productId));
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
      // Redirect to payment gateway here
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to checkout. Try again.");
    }
  };

  

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-5">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.productId._id}
              className="flex items-center justify-between border-b pb-3 mb-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-medium">{item.productId.name}</h3>
                  <p className="text-gray-600">₹{item.productId.price}</p>
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
          ))}

          <div className="flex justify-between items-center mt-5">
            <h3 className="text-xl font-semibold">
              Total: ₹
              {cartItems.reduce(
                (total, item) => total + item.productId.price * item.quantity,
                0
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
  );
};

export default Cart;
