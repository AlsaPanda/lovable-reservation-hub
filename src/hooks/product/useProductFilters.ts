import { useState, useMemo } from "react";
import { Product } from "@/utils/types";

export const useProductFilters = (products: Product[], userRole: string | null, brand: string) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    // Basic brand filtering
    const brandFiltered = userRole === 'superadmin' 
      ? products 
      : products.filter(product => product.brand === brand);

    // If no search query, return brand filtered results
    if (!searchQuery.trim()) {
      return brandFiltered;
    }

    // Simple search implementation
    const query = searchQuery.trim().toLowerCase();
    return brandFiltered.filter(product => {
      const searchableFields = [
        product.name,
        product.reference,
        product.description
      ].filter(Boolean).map(field => field?.toLowerCase());

      return searchableFields.some(field => field?.includes(query));
    });
  }, [products, searchQuery, brand, userRole]);

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts
  };
};