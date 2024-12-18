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
  console.log('BulkActionsMenuContent - isSuperAdmin:', isSuperAdmin);
  console.log('BulkActionsMenuContent - onDelete:', onDelete);

  return (
    <DropdownMenuContent align="end" className="w-56">
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
            className="text-red-600 hover:text-red-500"
          />
        </>
      )}
    </DropdownMenuContent>
  );
};

export default BulkActionsMenuContent;