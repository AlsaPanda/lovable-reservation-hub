import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <Input
      type="text"
      placeholder="Rechercher par titre ou référence..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-full md:w-96"
    />
  );
};

export default SearchBar;