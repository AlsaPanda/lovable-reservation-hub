import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ImportMenuItemProps {
  onImport: () => void;
  isDisabled: boolean;
}

const ImportMenuItem = ({ onImport, isDisabled }: ImportMenuItemProps) => {
  return (
    <DropdownMenuItem 
      onClick={() => !isDisabled && onImport()}
      disabled={isDisabled}
      className="cursor-pointer"
    >
      Importer des produits
    </DropdownMenuItem>
  );
};

export default ImportMenuItem;