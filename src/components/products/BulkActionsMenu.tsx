import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FileDown } from "lucide-react";
import ImportDialog from "./ImportDialog";
import DeleteCatalogDialog from "./DeleteCatalogDialog";
import { Product } from "@/utils/types";
import { useBulkActions } from "./bulk-actions/useBulkActions";
import * as XLSX from 'xlsx';

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

  const downloadTemplate = () => {
    // Create sample data
    const data = [
      {
        reference: 'REF001',
        name: 'Exemple Produit 1',
        description: 'Description du produit 1',
        initial_quantity: 10,
        image_url: 'https://example.com/image1.jpg',
        purchase_price_ht: 15.50,
        sale_price_ttc: 20.00,
        product_url: 'https://example.com/produit1',
        brand: 'schmidt'
      },
      {
        reference: 'REF002',
        name: 'Exemple Produit 2',
        description: 'Description du produit 2',
        initial_quantity: 5,
        image_url: 'https://example.com/image2.jpg',
        purchase_price_ht: 25.00,
        sale_price_ttc: 30.00,
        product_url: 'https://example.com/produit2',
        brand: 'cuisinella'
      }
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Products");

    // Save file
    XLSX.writeFile(wb, "template_import_produits.xlsx");
  };

  // Prevent menu from closing when loading
  const handleMenuOpenChange = (open: boolean) => {
    if (!isDeleting) {
      return open;
    }
    return true;
  };

  return (
    <>
      <DropdownMenu onOpenChange={handleMenuOpenChange}>
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
            onClick={() => !isDeleting && setShowImportDialog(true)}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Importer des produits
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={downloadTemplate}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Télécharger le modèle
          </DropdownMenuItem>
          {isSuperAdmin && (
            <DropdownMenuItem 
              onClick={() => !isDeleting && setShowDeleteDialog(true)}
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