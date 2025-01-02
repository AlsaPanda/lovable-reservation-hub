import { useState, useMemo } from "react";
import { Product } from "@/utils/types";

export const useProductFilters = (products: Product[], userRole: string | null, brand: string) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProducts = useMemo(() => {
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
        
        return name.includes(query) || 
               reference.includes(query) || 
               description.includes(query);
      });
    }

    return results;
  }, [products, searchQuery, brand, userRole]);

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts
  };
};