import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Product } from "@/utils/types";

interface ReservationButtonProps {
  products: Product[];
  onReserve: () => void;
  disabled: boolean;
}

const ReservationButton = ({ products, onReserve, disabled }: ReservationButtonProps) => {
  // Calculer la quantité totale en s'assurant de ne pas compter en double
  const totalQuantity = products
    .filter(product => product.initial_quantity && product.initial_quantity > 0)
    .reduce((sum, product) => sum + product.initial_quantity, 0);

  console.log("Products with quantities:", products.filter(p => p.initial_quantity > 0).map(p => ({
    reference: p.reference,
    quantity: p.initial_quantity
  })));
  console.log("Total quantity:", totalQuantity);

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