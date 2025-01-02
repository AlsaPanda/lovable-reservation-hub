import { useState, useMemo } from "react";
import { Product } from "@/utils/types";

export const useProductFilters = (products: Product[], userRole: string | null, brand: string) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    console.log('[useProductFilters] Starting filtering with:', {
      totalProducts: products.length,
      searchQuery,
      userRole,
      brand
    });
    
    return products.filter(product => {
      // First filter by brand if not superadmin
      if (userRole !== 'superadmin' && product.brand !== brand) {
        return false;
      }

      // Then apply search filter if there's a query
      const query = searchQuery.trim().toLowerCase();
      if (!query) {
        return true;
      }
      
      const name = (product.name || '').toLowerCase();
      const reference = (product.reference || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      
      const matches = name.includes(query) || 
                     reference.includes(query) || 
                     description.includes(query);
                     
      console.log(`[useProductFilters] Product ${product.reference} matches: ${matches}`);
      return matches;
    });
  }, [products, searchQuery, brand, userRole]);

  console.log('[useProductFilters] Filtered products:', {
    total: filteredProducts.length,
    searchQuery
  });

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts
  };
};