import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { Download, Upload, Settings2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/utils/types";
import { exportProducts, importProducts } from "@/utils/productUtils";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BulkActionsMenuProps {
  onProductsImported: (products: Product[]) => void;
  products: Product[];
  userRole: string | null;
}

const BulkActionsMenu = ({ onProductsImported, products, userRole }: BulkActionsMenuProps) => {
  const { toast } = useToast();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [forceImport, setForceImport] = useState(false);

  const handleImport = async () => {
    if (!pendingFile) return;

    try {
      if (forceImport) {
        // Delete all existing products first
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

  const handleExport = () => {
    exportProducts(products);
    toast({
      title: "Export réussi",
      description: "Les produits ont été exportés avec succès.",
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setPendingFile(file);
    setShowImportDialog(true);
    event.target.value = '';
  };

  const isSuperAdmin = userRole === 'superadmin';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Actions en masse
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => document.getElementById('import-file')?.click()} className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Importer des produits
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport} className="cursor-pointer">
            <Download className="h-4 w-4 mr-2" />
            Exporter les produits
          </DropdownMenuItem>
          
          {isSuperAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)} 
                className="cursor-pointer text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer le catalogue
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'import</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Par défaut, seuls les nouveaux produits seront importés (import différentiel).
                Les produits existants ne seront pas modifiés.
              </p>
              {isSuperAdmin && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="force-import"
                    checked={forceImport}
                    onChange={(e) => setForceImport(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="force-import" className="text-sm font-medium">
                    Forcer l'import (supprime le catalogue existant)
                  </label>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingFile(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleImport}>Continuer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action va supprimer définitivement tous les produits du catalogue.
              Cette opération ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCatalog}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <input
        id="import-file"
        type="file"
        accept=".json,.xlsx"
        className="hidden"
        onChange={handleFileSelect}
      />
    </>
  );
};

export default BulkActionsMenu;