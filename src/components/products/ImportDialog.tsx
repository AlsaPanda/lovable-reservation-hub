import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Product } from "@/utils/types";
import ImportDialogContent from "./import/ImportDialogContent";
import { useImportDialog } from "./import/useImportDialog";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductsImported: (products: Product[]) => void;
  products: Product[];
  userRole: string | null;
}

const ImportDialog = ({
  open,
  onOpenChange,
  onProductsImported,
  products,
  userRole,
}: ImportDialogProps) => {
  const isSuperAdmin = userRole === 'superadmin';
  const {
    forceImport,
    setForceImport,
    isLoading,
    importCount,
    handleFileSelect,
    handleClose
  } = useImportDialog({ 
    onProductsImported, 
    onOpenChange, 
    open 
  });

  // Ensure dialog closes properly when not loading
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen && !isLoading) {
      handleClose();
    }
  };

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={handleDialogClose}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Importer des produits</AlertDialogTitle>
          <ImportDialogContent
            isSuperAdmin={isSuperAdmin}
            forceImport={forceImport}
            setForceImport={setForceImport}
            isLoading={isLoading}
            importCount={importCount}
            onFileSelect={handleFileSelect}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={handleClose}>
            Fermer
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImportDialog;