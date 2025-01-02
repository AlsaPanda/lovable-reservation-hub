import { useState, useMemo } from "react";
import { Product } from "@/utils/types";

export const useProductFilters = (products: Product[], userRole: string | null, brand: string) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProducts = useMemo(() => {
    console.log("[useProductFilters] Starting filtering with:", {
      totalProducts: products.length,
      searchQuery,
      userRole,
      brand
    });

    // First filter by brand if not superadmin
    let results = userRole === 'superadmin' 
      ? products 
      : products.filter(product => product.brand === brand);

    // Then apply search if there's a query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(query);
        const referenceMatch = product.reference.toLowerCase().includes(query);
        const descriptionMatch = product.description?.toLowerCase().includes(query) || false;
        
        return nameMatch || referenceMatch || descriptionMatch;
      });
    }

    console.log("[useProductFilters] Filtered results:", results.length);
    return results;
  }, [products, searchQuery, brand, userRole]);

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts
  };
};