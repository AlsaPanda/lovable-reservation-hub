import { useState, useMemo } from "react";
import { Product } from "@/utils/types";

export const useProductFilters = (products: Product[], userRole: string | null, brand: string) => {
  const [searchQuery, setSearchQuery] = useState("");
  console.log("[useProductFilters] Current state:", { searchQuery, totalProducts: products.length });

  const filteredProducts = useMemo(() => {
    console.log("[useProductFilters] Filtering products:", {
      totalProducts: products.length,
      searchQuery,
      userRole,
      brand
    });

    // First filter by brand
    let results = products;
    if (userRole !== 'superadmin') {
      results = products.filter(product => product.brand === brand);
      console.log("[useProductFilters] After brand filtering:", results.length);
    }

    // Then apply search if there's a query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.reference.toLowerCase().includes(query)
      );
      console.log("[useProductFilters] After search filtering:", results.length);
    }

    return results;
  }, [products, searchQuery, brand, userRole]);

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts
  };
};