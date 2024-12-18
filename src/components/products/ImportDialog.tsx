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
import { useState } from "react";
import { importProducts } from "@/utils/productUtils";
import { useToast } from "@/components/ui/use-toast";

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
  const fileInputRef = useState<HTMLInputElement | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      console.log('Starting import process with file:', file.name);
      const importedProducts = await importProducts(file, !forceImport);
      console.log('Products imported successfully:', importedProducts.length);
      
      onProductsImported(importedProducts);
      toast({
        title: "Import réussi",
        description: `${importedProducts.length} produits ont été importés avec succès.`,
        duration: 3000,
      });
      
      // Only close the dialog after successful import
      onOpenChange(false);
    } catch (error) {
      console.error('Import error:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'import",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'import",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      if (event.target) {
        event.target.value = ''; // Reset file input
      }
    }
  };

  const handleButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = (e) => handleFileChange(e as React.ChangeEvent<HTMLInputElement>);
    input.click();
  };

  return (
    <AlertDialog open={open} onOpenChange={(newOpen) => {
      if (!isLoading) {
        onOpenChange(newOpen);
      }
    }}>
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
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="force-import" className="text-sm font-medium text-gray-700">
                  Forcer l'import (remplacer tous les produits)
                </label>
              </div>
            )}

            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={handleButtonClick}
                disabled={isLoading}
                className="w-full"
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                {isLoading ? "Importation en cours..." : "Sélectionner un fichier Excel"}
              </Button>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => !isLoading && onOpenChange(false)}>
            {isLoading ? "Importation en cours..." : "Fermer"}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImportDialog;