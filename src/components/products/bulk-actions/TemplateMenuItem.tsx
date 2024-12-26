import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FileDown } from "lucide-react";

interface TemplateMenuItemProps {
  onDownload: () => void;
  isDisabled: boolean;
}

const TemplateMenuItem = ({ onDownload, isDisabled }: TemplateMenuItemProps) => {
  return (
    <DropdownMenuItem 
      onClick={onDownload}
      disabled={isDisabled}
      className="cursor-pointer"
    >
      <FileDown className="mr-2 h-4 w-4" />
      Télécharger le modèle
    </DropdownMenuItem>
  );
};

export default TemplateMenuItem;