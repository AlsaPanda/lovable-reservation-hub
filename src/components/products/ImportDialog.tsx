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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const importedProducts = await importProducts(file, !forceImport);
      onProductsImported(importedProducts);
      onOpenChange(false);
      toast({
        title: "Import réussi",
        description: `${importedProducts.length} produits ont été importés avec succès.`,
        duration: 3000,
      });
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
      event.target.value = ''; // Reset file input
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Importer des produits</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Par défaut, seuls les nouveaux produits seront importés (import différentiel).
              Les produits existants ne seront pas modifiés.
            </p>
            {isSuperAdmin && (
              <div className="flex items-center space-x-2 border rounded p-2 bg-gray-50">
                <input
                  type="checkbox"
                  id="force-import"
                  checked={forceImport}
                  onChange={(e) => setForceImport(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="force-import" className="text-sm font-medium text-gray-700">
                  Forcer l'import (supprime le catalogue existant)
                </label>
              </div>
            )}
            <div className="flex justify-center mt-4">
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx,.xls"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading}
                />
                <Button variant="outline" disabled={isLoading}>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  {isLoading ? "Importation..." : "Sélectionner un fichier"}
                </Button>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Fermer</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImportDialog;