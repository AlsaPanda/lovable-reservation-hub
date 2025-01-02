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
        console.log(`[useProductFilters] Product ${product.reference} filtered out due to brand mismatch`);
        return false;
      }

      // Then apply search filter if there's a query
      const query = searchQuery.trim().toLowerCase();
      if (!query) {
        console.log(`[useProductFilters] No search query, showing product ${product.reference}`);
        return true;
      }
      
      const name = (product.name || '').toLowerCase();
      const reference = (product.reference || '').toLowerCase();
      
      const matches = name.includes(query) || reference.includes(query);
      console.log(`[useProductFilters] Product ${product.reference} search match: ${matches} for query "${query}"`);
      return matches;
    });
  }, [products, searchQuery, brand, userRole]);

  console.log('[useProductFilters] Final filtered products:', {
    total: filteredProducts.length,
    searchQuery
  });

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts
  };
};