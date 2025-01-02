import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useBulkActions = () => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteCatalog = useCallback(async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      console.log('Starting catalog deletion...');
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
  }, [isDeleting, queryClient, toast]);

  const handleCloseDeleteDialog = useCallback((open: boolean) => {
    if (!isDeleting && !open) {
      setShowDeleteDialog(false);
    }
  }, [isDeleting]);

  const handleImportDialogClose = useCallback((open: boolean) => {
    if (!open) {
      console.log('Closing import dialog and refreshing products...');
      setShowImportDialog(false);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  }, [queryClient]);

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