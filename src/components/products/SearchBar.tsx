import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  console.log("[SearchBar] Rendering");
  
  return (
    <div className="relative w-full md:w-96">
      <Input
        type="search"
        placeholder="Rechercher par titre ou référence..."
        onChange={(e) => {
          console.log("[SearchBar] Search value:", e.target.value);
          onSearch(e.target.value);
        }}
        className="w-full"
      />
    </div>
  );
};

export default SearchBar;