import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <div className="relative w-full md:w-96">
      <Input
        type="search"
        placeholder="Rechercher par titre, référence ou description..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export default SearchBar;