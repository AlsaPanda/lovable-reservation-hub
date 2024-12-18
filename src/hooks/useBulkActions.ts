import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/utils/types";
import { importProducts } from "@/utils/productUtils";

export const useBulkActions = (onProductsImported: (products: Product[]) => void) => {
  const { toast } = useToast();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [forceImport, setForceImport] = useState(false);

  const handleImport = async () => {
    if (!pendingFile) return;

    try {
      if (forceImport) {
        const { error: deleteError } = await supabase.rpc('delete_all_products');
        if (deleteError) throw deleteError;
      }

      const importedProducts = await importProducts(pendingFile, !forceImport);
      onProductsImported(importedProducts);
      toast({
        title: "Import réussi",
        description: `${importedProducts.length} produits ont été importés avec succès.`,
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Erreur d'import",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'import",
        variant: "destructive",
      });
    }
    
    setPendingFile(null);
    setShowImportDialog(false);
    setForceImport(false);
  };

  const handleDeleteCatalog = async () => {
    try {
      const { error } = await supabase.rpc('delete_all_products');
      if (error) throw error;

      toast({
        title: "Catalogue supprimé",
        description: "Le catalogue a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Delete catalog error:', error);
      toast({
        title: "Erreur de suppression",
        description: "Une erreur est survenue lors de la suppression du catalogue",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setPendingFile(file);
    setShowImportDialog(true);
    event.target.value = '';
  };

  return {
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
  };
};