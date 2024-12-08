import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Product } from "@/utils/types";
import { useEffect, useState } from "react";

interface ReservationButtonProps {
  products: Product[];
  onReserve: () => void;
  disabled: boolean;
}

const ReservationButton = ({ products, onReserve, disabled }: ReservationButtonProps) => {
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    // Calcul du total des quantités à chaque changement des produits
    const total = products.reduce((acc, product) => {
      if (!product.initial_quantity || product.initial_quantity <= 0) return acc;
      return acc + product.initial_quantity;
    }, 0);
    setTotalQuantity(total);
  }, [products]);

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