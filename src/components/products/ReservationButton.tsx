import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface ReservationButtonProps {
  onReserve: () => void;
  disabled: boolean;
  totalQuantity: number;
}

const ReservationButton = ({ onReserve, disabled, totalQuantity }: ReservationButtonProps) => {
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