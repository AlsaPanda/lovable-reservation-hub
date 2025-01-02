import { useState, useEffect } from "react";
import { Product } from "@/utils/types";

export const useProductFilters = (
  products: Product[] | undefined, 
  userRole: string | null, 
  brand: string,
  searchQuery: string
) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    console.log("[useProductFilters] Filtering with:", { 
      productsCount: products?.length, 
      searchQuery, 
      userRole, 
      brand 
    });

    if (!products) {
      setFilteredProducts([]);
      return;
    }

    // First filter by brand if not superadmin
    let results = userRole === 'superadmin' 
      ? products 
      : products.filter(product => product.brand === brand);

    // Then apply search filter if there's a query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.reference.toLowerCase().includes(query) ||
        (product.description?.toLowerCase() || '').includes(query)
      );
    }

    console.log("[useProductFilters] Filtered results:", results.length);
    setFilteredProducts(results);
  }, [products, searchQuery, userRole, brand]);

  return {
    filteredProducts
  };
};