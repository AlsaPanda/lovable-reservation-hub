/**
 * ProductsHeader Component
 * 
 * Main header section for the products page containing search, import/export,
 * and reservation action components. Manages the overall product list actions.
 */

import { Product } from "@/utils/types";
import { useUserProfile } from "@/hooks/useUserProfile";
import ImportExportActions from "./ImportExportActions";
import ReservationActions from "./ReservationActions";
import SearchBar from "./SearchBar";
import { importProducts } from "@/utils/productUtils";

interface ProductsHeaderProps {
  onOpenDialog: () => void;
  onProductsImported: (products: Product[]) => void;
  onSearch: (query: string) => void;
  onReserve: () => void;
  totalQuantity: number;
  isLoading?: boolean;
  productsToReserve: Product[];
  onQuantityChange: (reference: string, quantity: string) => void;
}

const ProductsHeader = ({
  onOpenDialog,
  onProductsImported,
  onSearch,
  onReserve,
  totalQuantity,
  isLoading,
  productsToReserve,
  onQuantityChange
}: ProductsHeaderProps) => {
  const { userRole } = useUserProfile();
  const isAdmin = userRole === "superadmin";

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const products = await importProducts(file);
        onProductsImported(products);
      } catch (error) {
        console.error('Error importing products:', error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <SearchBar onSearch={onSearch} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {isAdmin && (
          <ImportExportActions
            onOpenDialog={onOpenDialog}
            onProductsImported={onProductsImported}
            onFileChange={handleFileChange}
          />
        )}
        {!isAdmin && (
          <ReservationActions
            onReserve={onReserve}
            onReset={() => {}}
            totalQuantity={totalQuantity}
            canResetQuantities={totalQuantity > 0}
            isLoading={isLoading}
            productsToReserve={productsToReserve}
            onQuantityChange={onQuantityChange}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsHeader;