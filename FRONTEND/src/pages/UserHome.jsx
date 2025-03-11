import React from 'react'

const UserHome=()=> {

  return (
    <div>
        
      
    </div>
  )
}

export default UserHome

//     <div className="container mx-auto p-5">
//       <h2 className="text-2xl font-bold mb-4">Admin Product List</h2>
//       {products.length === 0 ? (
//         <p>No products available</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {products.map((product) => (
//             <div key={product._id} className="border p-4 rounded-lg shadow-md">
//               <img
//   src={product.images?.[0]} // Get the first image from the array
//   alt={product.name}
//   className="w-full h-40 object-cover rounded-md"
// />
//               <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
//               <p className="text-gray-600">Price: ${product.price}</p>
//               <button
//                 onClick={() => handleDelete(product._id)}
//                 className="mt-3 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
