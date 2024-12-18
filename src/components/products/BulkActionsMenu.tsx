import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ImportDialog from "./ImportDialog";
import DeleteCatalogDialog from "./DeleteCatalogDialog";
import { Product } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface BulkActionsMenuProps {
  onProductsImported: (products: Product[]) => void;
  products: Product[];
  userRole: string | null;
}

const BulkActionsMenu = ({ onProductsImported, products, userRole }: BulkActionsMenuProps) => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isSuperAdmin = userRole === 'superadmin';

  const handleDeleteCatalog = async () => {
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

      // Invalidate the products query to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast({
        title: "Catalogue supprimé",
        description: "Le catalogue a été supprimé avec succès.",
        duration: 3000, // Set duration to 3 seconds
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
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
            Importer des produits
          </DropdownMenuItem>
          {isSuperAdmin && (
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 focus:text-red-600"
            >
              Supprimer le catalogue
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onProductsImported={onProductsImported}
        products={products}
        userRole={userRole}
      />

      <DeleteCatalogDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteCatalog}
      />
    </>
  );
};

export default BulkActionsMenu;