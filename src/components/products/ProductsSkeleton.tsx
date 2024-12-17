import React from 'react';
import NavBar from "@/components/NavBar";

const ProductsSkeleton = () => {
  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsSkeleton;