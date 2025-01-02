import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    console.log("[SearchBar] Triggering search with value:", debouncedValue);
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  console.log("[SearchBar] Input changed:", value);

  return (
    <div className="relative w-full md:w-96">
      <Input
        type="search"
        value={value}
        placeholder="Rechercher par titre, référence ou description..."
        onChange={(e) => setValue(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export default SearchBar;