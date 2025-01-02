import { useState, useMemo } from "react";
import { Product } from "@/utils/types";

export const useProductFilters = (products: Product[], userRole: string | null, brand: string) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProducts = useMemo(() => {
    console.log("[useProductFilters] Starting filtering with:", { products, searchQuery, userRole, brand });
    
    // First filter by brand if not superadmin
    let results = userRole === 'superadmin' 
      ? products 
      : products.filter(product => product.brand === brand);

    // Then apply search if there's a query
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      results = results.filter(product => {
        const name = (product.name || '').toLowerCase();
        const reference = (product.reference || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        
        const matches = name.includes(query) || 
                       reference.includes(query) || 
                       description.includes(query);
        
        console.log(`[useProductFilters] Product ${product.reference} matches:`, matches);
        return matches;
      });
    }

    console.log("[useProductFilters] Filtered products:", results);
    return results;
  }, [products, searchQuery, brand, userRole]);

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts
  };
};