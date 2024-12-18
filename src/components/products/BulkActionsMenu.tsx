import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, Upload, Settings2, Trash2 } from "lucide-react";
import { Product } from "@/utils/types";
import { exportProducts } from "@/utils/productUtils";
import ImportDialog from "./ImportDialog";
import DeleteCatalogDialog from "./DeleteCatalogDialog";
import { useBulkActions } from "@/hooks/useBulkActions";

interface BulkActionsMenuProps {
  onProductsImported: (products: Product[]) => void;
  products: Product[];
  userRole: string | null;
}

const BulkActionsMenu = ({ onProductsImported, products, userRole }: BulkActionsMenuProps) => {
  const {
    showImportDialog,
    setShowImportDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    pendingFile,
    setPendingFile,
    forceImport,
    setForceImport,
    handleImport,
    handleDeleteCatalog,
    handleFileSelect,
  } = useBulkActions(onProductsImported);

  const handleExport = () => {
    exportProducts(products);
  };

  const isSuperAdmin = userRole === 'superadmin';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Actions en masse
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => document.getElementById('import-file')?.click()} className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Importer des produits
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport} className="cursor-pointer">
            <Download className="h-4 w-4 mr-2" />
            Exporter les produits
          </DropdownMenuItem>
          
          {isSuperAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)} 
                className="cursor-pointer text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer le catalogue
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ImportDialog
        showDialog={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={handleImport}
        onCancel={() => setPendingFile(null)}
        forceImport={forceImport}
        setForceImport={setForceImport}
        isSuperAdmin={isSuperAdmin}
      />

      <DeleteCatalogDialog
        showDialog={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={handleDeleteCatalog}
      />

      <input
        id="import-file"
        type="file"
        accept=".json,.xlsx"
        className="hidden"
        onChange={handleFileSelect}
      />
    </>
  );
};

export default BulkActionsMenu;