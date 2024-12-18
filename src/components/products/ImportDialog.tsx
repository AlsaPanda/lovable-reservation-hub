import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/utils/types";
import { UploadCloud } from "lucide-react";
import { useState, useCallback } from "react";
import { importProducts } from "@/utils/productUtils";
import { useToast } from "@/hooks/use-toast";

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
  const [forceImport, setForceImport] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [importCount, setImportCount] = useState<number | null>(null);

  const resetState = useCallback(() => {
    setIsLoading(false);
    setImportCount(null);
    setForceImport(false);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setImportCount(null);
    
    try {
      console.log('Starting import process with file:', file.name);
      const importedProducts = await importProducts(file, !forceImport);
      console.log('Products imported successfully:', importedProducts.length);
      
      setImportCount(importedProducts.length);
      onProductsImported(importedProducts);
      
      if (importedProducts.length > 0) {
        toast({
          title: "Import réussi",
          description: importedProducts.length === 1 
            ? "1 produit a été importé avec succès."
            : `${importedProducts.length} produits ont été importés avec succès.`,
          duration: 3000,
        });
        
        handleClose();
      } else {
        toast({
          variant: "default",
          title: "Aucun produit importé",
          description: "Aucun nouveau produit n'a été trouvé dans le fichier.",
          duration: 3000,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'import",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'import",
        duration: 3000,
      });
      setIsLoading(false);
    }

    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleButtonClick = () => {
    if (isLoading) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = (e) => {
      const event = e as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    };
    input.click();
  };

  const handleClose = useCallback(() => {
    if (!isLoading) {
      resetState();
      onOpenChange(false);
    }
  }, [isLoading, onOpenChange, resetState]);

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Importer des produits</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Par défaut, seuls les nouveaux produits seront importés (import différentiel).
              {isSuperAdmin && " En tant que superadmin, vous pouvez forcer l'import de tous les produits."}
            </p>

            {isSuperAdmin && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="force-import"
                  checked={forceImport}
                  onChange={(e) => setForceImport(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label 
                  htmlFor="force-import" 
                  className={`text-sm font-medium ${isLoading ? 'text-gray-400' : 'text-gray-700'}`}
                >
                  Forcer l'import (remplacer tous les produits)
                </label>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Button 
                variant="outline" 
                onClick={handleButtonClick}
                disabled={isLoading}
                className="w-full"
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                {isLoading ? "Importation en cours..." : "Sélectionner un fichier Excel"}
              </Button>
              
              {isLoading && (
                <p className="text-sm text-center text-muted-foreground animate-pulse">
                  Import en cours, veuillez patienter...
                </p>
              )}
              
              {importCount !== null && !isLoading && (
                <p className="text-sm text-center text-green-600 font-medium">
                  {importCount === 0 
                    ? "Aucun nouveau produit n'a été trouvé dans le fichier."
                    : importCount === 1 
                      ? "1 produit a été importé avec succès."
                      : `${importCount} produits ont été importés avec succès.`}
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Fermer
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImportDialog;