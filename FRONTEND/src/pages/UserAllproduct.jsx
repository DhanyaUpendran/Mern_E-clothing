import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../components/Topbar';

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/products`, { 
        params,
        withCredentials: true,
      });
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/products/categories`, {
        withCredentials: true,
      });
      setCategories(data.categories);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  // Function to handle View Details button click
  const handleViewDetails = async (productId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${productId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        navigate(`/productdetails/${productId}`);
      }
    } catch (error) {
      console.error('Unauthorized:', error);
      alert('Unauthorized user, please sign up!');
    }
  };

  return (
    <div>
      <Topbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Our Products</h1>
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/4">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            {(searchTerm || selectedCategory) && (
              <button onClick={clearFilters} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">
                Clear Filters
              </button>
            )}
          </div>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {product.images?.length ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{product.category}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.details}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                      onClick={() => handleViewDetails(product._id)}
                    >
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProductsPage;
