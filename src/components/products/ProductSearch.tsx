import React from "react";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
  onSearch: (query: string) => void;
}

const ProductSearch = ({ onSearch }: ProductSearchProps) => {
  return (
    <Input
      type="search"
      placeholder="Rechercher par nom ou référence..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-full md:w-[300px]"
    />
  );
};

export default ProductSearch;