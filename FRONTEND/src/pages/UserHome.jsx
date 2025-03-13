import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from '../components/Footer'
import Navbar from "../components/Navbar"
import Banner from "../components/Banner"
const UserHome=()=> {
   const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
  
  
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/user/?page=${currentPage}&limit=3`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages); // Update total pages
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();
}, [currentPage]); // Runs whenever `currentPage` changes
  return (
    <div>
      <Navbar />
      <Banner />
      <div className="container mx-auto bg-[#46291E]  p-5">
    <h2 className="text-2xl font-bold mb-5 text-white">LATEST ON SALE</h2>

    {/* Product Grid */}
    <div className="grid grid-cols-3 gap-1">
  {products.map((product) => (
    <div key={product._id} 
    className="card bg-base-100 shadow-sm w-64 transition-transform duration-300 hover:scale-105 cursor-pointer">
      <figure className="w-full h-40">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]} // Use the first image
            alt={product.name}
            className="w-full h-full object-cover" // Ensures image fits perfectly
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = "/placeholder.jpg"; // Fallback image
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 rounded-t-xl">
            No Image Available
          </div>
        )}
      </figure>

      <div className="card-body items-center text-center p-4">
        <h2 className="card-title text-sm">{product.name}</h2> {/* Smaller text */}
        <p className="text-gray-600 text-sm">${product.price}</p>
        <div className="card-actions">
          <button className="btn btn-primary btn-sm">View Details</button> {/* Smaller button */}
        </div>
      </div>
    </div>
  ))}
</div>

    {/* Pagination Controls */}
  <div className="flex justify-center mt-5">
    <button
      className={`px-4 py-2 mx-2 rounded ${currentPage === 1 ? "bg-gray-400" : "bg-blue-500 text-white"}`}
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Previous
    </button>

    <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>

    <button
      className={`px-4 py-2 mx-2 rounded ${currentPage === totalPages ? "bg-gray-400" : "bg-blue-500 text-white"}`}
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
</div>
 
  

        
      <Footer />
    </div>
  )
}

export default UserHome

