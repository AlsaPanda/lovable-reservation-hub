import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { Product } from "@/utils/types";
import { exportProducts } from "@/utils/productUtils";
import ImportDialog from "./ImportDialog";
import DeleteCatalogDialog from "./DeleteCatalogDialog";
import { useBulkActions } from "@/hooks/useBulkActions";
import BulkActionsMenuContent from "./bulk-actions/BulkActionsMenuContent";

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
  console.log('Is Super Admin:', isSuperAdmin);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Actions en masse
          </Button>
        </DropdownMenuTrigger>
        
        <BulkActionsMenuContent
          onImport={() => document.getElementById('import-file')?.click()}
          onExport={handleExport}
          onDelete={isSuperAdmin ? () => setShowDeleteDialog(true) : undefined}
          isSuperAdmin={isSuperAdmin}
        />
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