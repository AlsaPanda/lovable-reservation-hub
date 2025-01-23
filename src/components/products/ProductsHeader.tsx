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

interface ProductsHeaderProps {
  onOpenDialog: () => void;
  onProductsImported: (products: Product[]) => void;
  onSearch: (query: string) => void;
  onReserve: () => void;
  totalQuantity: number;
  isLoading?: boolean;
  productsToReserve: Product[];
}

const ProductsHeader = ({
  onOpenDialog,
  onProductsImported,
  onSearch,
  onReserve,
  totalQuantity,
  isLoading,
  productsToReserve
}: ProductsHeaderProps) => {
  const { userRole } = useUserProfile();
  const isAdmin = userRole === "superadmin";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <SearchBar onSearch={onSearch} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {isAdmin && (
          <ImportExportActions
            onOpenDialog={onOpenDialog}
            onProductsImported={onProductsImported}
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
          />
        )}
      </div>
    </div>
  );
};

export default ProductsHeader;