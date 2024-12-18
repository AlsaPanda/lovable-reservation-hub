import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import ImportDialog from "./ImportDialog";
import DeleteCatalogDialog from "./DeleteCatalogDialog";
import { Product } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface BulkActionsMenuProps {
  onProductsImported: (products: Product[]) => void;
  products: Product[];
  userRole: string | null;
}

const BulkActionsMenu = ({ onProductsImported, products, userRole }: BulkActionsMenuProps) => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isSuperAdmin = userRole === 'superadmin';

  // Reset states when component unmounts
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" disabled={isDeleting}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={() => setShowImportDialog(true)}
            disabled={isDeleting}
          >
            Importer des produits
          </DropdownMenuItem>
          {isSuperAdmin && (
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 focus:text-red-600"
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