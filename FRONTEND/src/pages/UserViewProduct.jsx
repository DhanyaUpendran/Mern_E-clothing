import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Topbar from '../components/Topbar';

const UserViewProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/user/${productId}`, {
          withCredentials: true,
        });
        setProduct(response.data.product);
        
        // Set the first available size as default
        const availableSizes = Object.entries(response.data.product.sizes)
          .filter(([_, available]) => available)
          .map(([size]) => size);
        
        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details. Please try again later.");
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    
    try {
      await axios.post(
        `http://localhost:3000/user/cart/add/${productId}`,
        {
          productId,
          size: selectedSize,
          quantity,
        },
        { withCredentials: true }
      );
      
      alert("Product added to cart successfully!");
      navigate("/usercart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

 

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div>
      <Topbar/>
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section - REDUCED SIZE */}
        <div className="space-y-4">
          {/* Main Image - REDUCED SIZE */}
          <div className="max-w-md mx-auto">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border max-h-80">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          {/* Image Gallery - REDUCED SIZE */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto py-2 justify-center">
              {product.images.map((img, index) => (
                <div 
                  key={index} 
                  className={`cursor-pointer rounded-md overflow-hidden w-16 h-16 border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={img} 
                    alt={`Product view ${index + 1}`} 
                    className="w-full h-full object-cover object-center" 
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-xl md:text-2xl font-semibold text-blue-600 mt-2">${parseFloat(product.price).toFixed(2)}</p>
          </div>

          {/* Category */}
          <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
            {product.category}
          </div>

          {/* Sizes with Selection Logic */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(product.sizes).map(([size, available]) => (
                available ? (
                  <button 
                    key={size} 
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${
                      selectedSize === size 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'border border-gray-300 hover:border-blue-500 text-gray-800'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ) : (
                  <button 
                    key={size} 
                    className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center font-medium text-gray-400 cursor-not-allowed bg-gray-50"
                    disabled
                  >
                    {size}
                  </button>
                )
              ))}
            </div>
            {selectedSize && (
              <p className="mt-2 text-sm text-green-600">Size {selectedSize} selected</p>
            )}
          </div>

          {/* Quantity Selector */}
          <div >
            <h3 className="text-lg font-medium text-gray-800 mb-2">Quantity</h3>
            <div className="flex items-center text-black">
              <button
                className="w-10 h-10 rounded-l border border-gray-300 flex items-center justify-center text-xl  font-medium"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                -
              </button>
              <div className="w-16 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                {quantity}
              </div>
              <button
                className="w-10 h-10 rounded-r border border-gray-300 flex items-center justify-center text-xl font-medium"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Product Details</h3>
            <div className="text-gray-600 leading-relaxed max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pr-2">
              <p>{product.details}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button 
              className={`flex-1 py-3 px-6 rounded-lg transition font-medium ${
                selectedSize 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-blue-200 text-gray-600 cursor-not-allowed'
              }`}
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              Add to Cart
            </button>
        
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserViewProduct;