import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    details: "", 
    category: "",
    sizes: { S: false, M: false, XL: false, XXL: false },
    images: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        console.log("Checking auth with token:", token);

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/admindashboard`, {
          
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProductData((prev) => ({ ...prev, images: [...e.target.files] }));
  };
  const handleSizeChange = (size) => {
    setProductData((prev) => ({
      ...prev,
      sizes: { ...prev.sizes, [size]: !prev.sizes[size] }, // Toggle selection
    }));
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Frontend validation
    if (!productData.images.length) {
      setError("At least one image is required");
      return;
    }

    if (!Object.values(productData.sizes).some(size => size)) {
      setError("At least one size must be selected");
      return;
    }

    const formData = new FormData();
    formData.append("name", productData.name.trim());
    formData.append("price", parseFloat(productData.price));
    formData.append("details", productData.details.trim());
    formData.append("category", productData.category.trim());
    formData.append("sizes", JSON.stringify(productData.sizes));
    
    productData.images.forEach((image) => {
      formData.append("images", image);
    });
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/addproduct`,
        formData,
        {
          
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        alert("Product added successfully!");
        navigate("/getproduct");
      }
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Failed to add product");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Product</h2>

      {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-200 text-green-800 p-3 rounded mb-4">Product added successfully!</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block font-medium text-gray-600">Product Name:</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium text-gray-600">Price:</label>
          <input
            type="number"
            name="price"
            step="0.01"
            value={productData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Details */}
        <div>
          <label className="block font-medium text-gray-600">Details:</label>
          <textarea
            name="details"
            value={productData.details}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium text-gray-600">Category:</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Sizes */}
        <div>
        <label className="block font-medium text-gray-700">Sizes:</label>
  <div className="flex flex-wrap gap-4 mt-2">
    {["S", "M", "L", "XL", "XXL"].map((size) => (
      <label
        key={size}
        className={`flex items-center gap-2 px-3 py-1 rounded-lg border 
        ${productData.sizes[size] ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-800"} 
        cursor-pointer transition duration-200 ease-in-out`}
      >
        <input
          type="checkbox"
          checked={productData.sizes[size] || false}
          onChange={() => handleSizeChange(size)}
          className="hidden" // Hide default checkbox
        />
        <span
          className={`w-5 h-5 flex items-center justify-center border rounded-md 
          ${productData.sizes[size] ? "bg-white border-white text-blue-600" : "border-gray-400"}`}
        >
          {productData.sizes[size] && "✓"}
        </span>
        {size}
      </label>
            ))}
          </div>
        </div>

        {/* Product Images */}
        <div>
          <label className="block font-medium text-gray-600">Product Images:</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AdminAddProduct;

