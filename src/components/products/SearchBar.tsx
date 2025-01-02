import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    console.log("[SearchBar] Debounced value changed:", debouncedValue);
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log("[SearchBar] Input changed:", newValue);
    setValue(newValue);
  };

  return (
    <div className="relative w-full md:w-96">
      <Input
        type="search"
        value={value}
        placeholder="Rechercher par titre, référence ou description..."
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
};

export default SearchBar;