import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import ImportDialog from "./ImportDialog";
import DeleteCatalogDialog from "./DeleteCatalogDialog";
import { Product } from "@/utils/types";
import { useBulkActions } from "./bulk-actions/useBulkActions";

interface BulkActionsMenuProps {
  onProductsImported: (products: Product[]) => void;
  products: Product[];
  userRole: string | null;
}

const BulkActionsMenu = ({ 
  onProductsImported, 
  products, 
  userRole 
}: BulkActionsMenuProps) => {
  const {
    showImportDialog,
    setShowImportDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    handleDeleteCatalog,
    handleCloseDeleteDialog,
    handleImportDialogClose
  } = useBulkActions();

  const isSuperAdmin = userRole === 'superadmin';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            disabled={isDeleting}
            className="relative"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={() => setShowImportDialog(true)}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Importer des produits
          </DropdownMenuItem>
          {isSuperAdmin && (
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 focus:text-red-600 cursor-pointer"
              disabled={isDeleting}
            >
              Supprimer le catalogue
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ImportDialog
        open={showImportDialog}
        onOpenChange={handleImportDialogClose}
        onProductsImported={onProductsImported}
        products={products}
        userRole={userRole}
      />

      <DeleteCatalogDialog
        open={showDeleteDialog}
        onOpenChange={handleCloseDeleteDialog}
        onConfirm={handleDeleteCatalog}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default BulkActionsMenu;