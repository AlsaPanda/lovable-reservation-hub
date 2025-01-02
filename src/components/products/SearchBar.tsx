import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
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