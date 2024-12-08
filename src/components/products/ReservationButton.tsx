import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Product } from "@/utils/types";

interface ReservationButtonProps {
  products: Product[];
  onReserve: () => void;
  disabled: boolean;
}

const ReservationButton = ({ products, onReserve, disabled }: ReservationButtonProps) => {
  // Ne compter que les produits qui ont une quantité > 0
  const totalQuantity = products
    .filter(product => product.initial_quantity > 0)
    .reduce((sum, product) => sum + Number(product.initial_quantity), 0);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        onClick={onReserve}
        disabled={disabled || totalQuantity === 0}
        className="shadow-lg"
      >
        <Calendar className="mr-2 h-4 w-4" />
        Je réserve ({totalQuantity} produits)
      </Button>
    </div>
  );
};

export default ReservationButton;