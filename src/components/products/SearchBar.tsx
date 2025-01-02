import { Input } from "@/components/ui/input";
import { useCallback } from "react";
import { debounce } from "lodash";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      console.log('[SearchBar] Triggering search with value:', value);
      onSearch(value);
    }, 300),
    [onSearch]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('[SearchBar] Input changed:', value);
    debouncedSearch(value);
  };

  return (
    <div className="relative w-full md:w-96">
      <Input
        type="search"
        placeholder="Rechercher par titre ou référence..."
        onChange={handleSearch}
        className="w-full"
      />
    </div>
  );
};

export default SearchBar;