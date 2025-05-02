
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


const CheckoutBilling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    try {
      // Validate form
      const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zip"];
      const missingFields = requiredFields.filter(field => !billingDetails[field]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
        return;
      }

      setLoading(true);
       // Fetch Razorpay Key from Backend
       const keyResponse = await axios.get('http://localhost:3000/get-razorpay-key',);
      const razorpayKey = keyResponse.data.key;
      // Call your backend to create Razorpay order
      const { data } = await axios.post(
        "http://localhost:3000/user/checkout",
        { billingDetails },
        { withCredentials: true }
      );

      if (!data.success) {
        alert("Failed to initiate payment.");
        setLoading(false);
        return;
      }

      // Load Razorpay script dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        // Razorpay Payment Process
        const options = {
          key: razorpayKey, // Replace with your Razorpay Key ID
          amount: data.order.amount,
          currency: "INR",
          name: "E-Commerce",
          description: "Order Payment",
          order_id: data.order.id,
          handler: async (response) => {
            console.log("Payment response:", response);
            try {
              // Verify Payment & Save Order
              const verifyRes = await axios.post(
                "http://localhost:3000/user/checkout/verify-payment",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  billingDetails, // Send Billing Details
                },
                { withCredentials: true }
              );

              if (verifyRes.data.success) {
                navigate("/order-success");
              } else {
                alert("Payment verification failed.");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              alert("Error verifying payment.");
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: `${billingDetails.firstName} ${billingDetails.lastName}`,
            email: billingDetails.email,
            contact: billingDetails.phone,
          },
          theme: { color: "#3399cc" },
          modal: {
            ondismiss: function() {
              setLoading(false);
            }
          }
        };

        try {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } catch (error) {
          console.error("Razorpay initialization error:", error);
          alert("Failed to initialize payment gateway.");
          setLoading(false);
        }
      };
      
      script.onerror = () => {
        alert("Failed to load payment gateway. Please try again later.");
        setLoading(false);
      };
      
      document.body.appendChild(script);
      
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to proceed with checkout.");
      setLoading(false);
    }
  };

  return (
    <div>
      
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg text-black">
      <h2 className="text-2xl font-semibold mb-5">📋 Billing Details</h2>

      <form className="grid gap-4 text-black">
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            name="firstName" 
            placeholder="First Name" 
            onChange={handleChange} 
            className="border p-2 rounded" 
            required
          />
          <input 
            type="text" 
            name="lastName" 
            placeholder="Last Name" 
            onChange={handleChange} 
            className="border p-2 rounded" 
            required
          />
        </div>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required
        />
        <input 
          type="tel" 
          name="phone" 
          placeholder="Phone Number" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required
        />
        <input 
          type="text" 
          name="address" 
          placeholder="Address" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            name="city" 
            placeholder="City" 
            onChange={handleChange} 
            className="border p-2 rounded" 
            required
          />
          <input 
            type="text" 
            name="state" 
            placeholder="State" 
            onChange={handleChange} 
            className="border p-2 rounded" 
            required
          />
        </div>
        <input 
          type="text" 
          name="zip" 
          placeholder="ZIP Code" 
          onChange={handleChange} 
          className="border p-2 rounded" 
          required
        />

        <button 
          type="button" 
          onClick={handlePayment} 
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </form>
    </div>
    </div>
  );
};

export default CheckoutBilling;