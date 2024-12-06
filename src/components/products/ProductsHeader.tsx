import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import BulkActionsMenu from "./BulkActionsMenu";
import { Product } from "@/utils/types";

interface ProductsHeaderProps {
  onOpenDialog: () => void;
  onProductsImported: (products: Product[]) => void;
  products: Product[];
}

const ProductsHeader = ({ onOpenDialog, onProductsImported, products }: ProductsHeaderProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="gap-2" onClick={onOpenDialog}>
            <Plus className="h-4 w-4" />
            Ajouter un produit
          </Button>
        </DialogTrigger>
      </Dialog>

      <BulkActionsMenu 
        onProductsImported={onProductsImported}
        products={products}
      />
    </div>
  );
};

export default ProductsHeader;