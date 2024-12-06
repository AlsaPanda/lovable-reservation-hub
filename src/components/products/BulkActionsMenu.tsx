import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, Upload, Settings2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/utils/types";
import { exportProducts, importProducts } from "@/utils/productUtils";

interface BulkActionsMenuProps {
  onProductsImported: (products: Product[]) => void;
  products: Product[];
}

const BulkActionsMenu = ({ onProductsImported, products }: BulkActionsMenuProps) => {
  const { toast } = useToast();
  
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedProducts = await importProducts(file);
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
    
    event.target.value = '';
  };

  const handleExport = () => {
    exportProducts(products);
    toast({
      title: "Export réussi",
      description: "Les produits ont été exportés avec succès.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Actions en masse
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => document.getElementById('import-file')?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Importer des produits
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exporter les produits
        </DropdownMenuItem>
      </DropdownMenuContent>
      <input
        id="import-file"
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
    </DropdownMenu>
  );
};

export default BulkActionsMenu;