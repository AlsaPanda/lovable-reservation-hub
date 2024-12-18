import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useBulkActions = () => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      setShowImportDialog(false);
      setShowDeleteDialog(false);
      setIsDeleting(false);
    };
  }, []);

  const handleDeleteCatalog = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_all_products');
      
      if (error) {
        console.error('Error deleting catalog:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression du catalogue.",
        });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast({
        title: "Catalogue supprimé",
        description: "Le catalogue a été supprimé avec succès.",
        duration: 3000,
      });
      
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error in handleDeleteCatalog:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setShowDeleteDialog(false);
    }
  };

  const handleImportDialogClose = (open: boolean) => {
    if (!open) {
      setShowImportDialog(false);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  };

  return {
    showImportDialog,
    setShowImportDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    handleDeleteCatalog,
    handleCloseDeleteDialog,
    handleImportDialogClose
  };
};