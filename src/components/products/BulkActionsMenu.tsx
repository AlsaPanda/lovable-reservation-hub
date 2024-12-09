import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { Download, Upload, Settings2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/utils/types";
import { exportProducts, importProducts } from "@/utils/productUtils";
import { useState } from "react";

interface BulkActionsMenuProps {
  onProductsImported: (products: Product[]) => void;
  products: Product[];
}

const BulkActionsMenu = ({ onProductsImported, products }: BulkActionsMenuProps) => {
  const { toast } = useToast();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setPendingFile(file);
    setShowImportDialog(true);
    event.target.value = '';
  };

  const handleImport = async () => {
    if (!pendingFile) return;

    try {
      const importedProducts = await importProducts(pendingFile);
      onProductsImported(importedProducts);
      toast({
        title: "Import réussi",
        description: `${importedProducts.length} produits ont été importés avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'import",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'import",
        variant: "destructive",
      });
    }
    
    setPendingFile(null);
    setShowImportDialog(false);
  };

  const handleExport = () => {
    exportProducts(products);
    toast({
      title: "Export réussi",
      description: "Les produits ont été exportés avec succès.",
    });
  };

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
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'import</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action va remplacer tous les produits existants. Cette opération ne peut pas être annulée.
              Les descriptions en français (description-fr_FR) seront ignorées lors de l'import.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingFile(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleImport}>Continuer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <input
        id="import-file"
        type="file"
        accept=".json,.xlsx"
        className="hidden cursor-pointer"
        onChange={handleFileSelect}
      />
    </>
  );
};

export default BulkActionsMenu;