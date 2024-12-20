import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/utils/types";
import { importProducts } from "@/utils/productUtils";

interface UseImportDialogProps {
  onProductsImported: (products: Product[]) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const useImportDialog = ({ 
  onProductsImported, 
  onOpenChange, 
  open 
}: UseImportDialogProps) => {
  const [forceImport, setForceImport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [importCount, setImportCount] = useState<number | null>(null);
  const { toast } = useToast();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setIsLoading(false);
      setImportCount(null);
      setForceImport(false);
    }
  }, [open]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setImportCount(null);
    
    try {
      console.log('Starting import process with file:', file.name);
      const importedProducts = await importProducts(file, !forceImport);
      console.log('Products imported successfully:', importedProducts.length);
      
      setImportCount(importedProducts.length);
      
      if (importedProducts.length > 0) {
        onProductsImported(importedProducts);
        
        toast({
          title: "Import réussi",
          description: importedProducts.length === 1 
            ? "1 produit a été importé avec succès."
            : `${importedProducts.length} produits ont été importés avec succès.`,
          duration: 3000,
        });
        
        // Ensure we reset states before closing
        setIsLoading(false);
        onOpenChange(false);
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
    } finally {
      setIsLoading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  }, [forceImport, onProductsImported, toast, onOpenChange]);

  const handleFileSelect = useCallback(() => {
    if (isLoading) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = (e) => {
      const event = e as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    };
    input.click();
  }, [handleFileChange, isLoading]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setIsLoading(false);
      setImportCount(null);
      setForceImport(false);
      onOpenChange(false);
    }
  }, [isLoading, onOpenChange]);

  return {
    forceImport,
    setForceImport,
    isLoading,
    importCount,
    handleFileSelect,
    handleClose
  };
};