import { DropdownMenuContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Download, Upload, Trash2 } from "lucide-react";
import BulkActionMenuItem from "./BulkActionMenuItem";

interface BulkActionsMenuContentProps {
  onImport: () => void;
  onExport: () => void;
  onDelete?: () => void;
  isSuperAdmin: boolean;
}

const BulkActionsMenuContent = ({ 
  onImport, 
  onExport, 
  onDelete, 
  isSuperAdmin 
}: BulkActionsMenuContentProps) => {
  return (
    <DropdownMenuContent>
      <BulkActionMenuItem
        icon={Upload}
        label="Importer des produits"
        onClick={onImport}
      />
      <BulkActionMenuItem
        icon={Download}
        label="Exporter les produits"
        onClick={onExport}
      />
      
      {isSuperAdmin && onDelete && (
        <>
          <DropdownMenuSeparator />
          <BulkActionMenuItem
            icon={Trash2}
            label="Supprimer le catalogue"
            onClick={onDelete}
            className="text-red-600"
          />
        </>
      )}
    </DropdownMenuContent>
  );
};

export default BulkActionsMenuContent;