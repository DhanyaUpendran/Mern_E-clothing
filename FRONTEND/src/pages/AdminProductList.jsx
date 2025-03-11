import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const checkAuthAndFetchProducts = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        console.log("Checking auth with token:", token);

        const response = await axios.get("http://localhost:3000/admin/getproduct", {
          
          withCredentials: true,
          
        });

        console.log("Auth check response:", response.data);

        if (response.status !== 200) {
          navigate("/adminlogin");
        }
    

        // Fetching products
        const productResponse = await axios.get("http://localhost:3000/admin/getproduct", {
          withCredentials: true,
        });

        console.log("Fetched products:", productResponse.data);
        setProducts(productResponse.data);
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        // navigate("/adminlogin");
      }
    };

    checkAuthAndFetchProducts();
  }, [navigate]);

  // Delete Product Function
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/admin/getproducts/${id}`,{
      withCredentials: true,
      })
      if (response.data.success) {
        // Filter out deleted product from state
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
        alert("Product deleted successfully");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
      alert("Error deleting product: " + (error.response?.data?.error || "Unknown error"));
    }
  };
  

  return (

<div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Admin Product List</h2>

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Sizes</th>
              <th className="border border-gray-300 p-2">Details</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="text-center">
                <td className="border border-gray-300 p-2">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0]} // Show first image
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="border border-gray-300 p-2">{product.name}</td>
                <td className="border border-gray-300 p-2">${product.price}</td>
                <td className="border border-gray-300 p-2">{product.category}</td>
                <td className="border border-gray-300 p-2">
                {product.sizes? Object.entries(product.sizes)
                      .filter(([_, available]) => available) // Show only available sizes
                     .map(([size]) => size)
                        .join(", ") || "N/A"
                   : "N/A"}
                </td>
                <td className="border border-gray-300 p-2">{product.details}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProductList;
