import { useState, useMemo } from "react";
import { Product } from "@/utils/types";

export const useProductFilters = (products: Product[], userRole: string | null, brand: string) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    console.log('[Products] Filtering products with query:', searchQuery);
    console.log('[Products] Total products before filtering:', products.length);
    
    return products.filter(product => {
      // First filter by brand if not superadmin
      if (userRole !== 'superadmin' && product.brand !== brand) {
        return false;
      }

      // Then apply search filter if there's a query
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      
      const name = (product.name || '').toLowerCase();
      const reference = (product.reference || '').toLowerCase();
      
      const matches = name.includes(query) || reference.includes(query);
      console.log(`[Products] Product ${product.reference} matches search: ${matches}`);
      return matches;
    });
  }, [products, searchQuery, brand, userRole]);

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts
  };
};