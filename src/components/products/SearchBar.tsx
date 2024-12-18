import { Input } from "@/components/ui/input";
import { useCallback } from "react";
import { debounce } from "lodash";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  // Debounce the search to avoid too many updates
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      console.log('Searching for:', value);
      onSearch(value);
    }, 300),
    [onSearch]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Search input changed:', value);
    debouncedSearch(value);
  };

  return (
    <Input
      type="text"
      placeholder="Rechercher par titre ou référence..."
      onChange={handleSearch}
      className="w-full md:w-96"
    />
  );
};

export default SearchBar;