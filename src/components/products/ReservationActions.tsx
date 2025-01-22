import { Button } from "@/components/ui/button";
import { Calendar, RotateCcw } from "lucide-react";

interface ReservationActionsProps {
  onReserve: () => void;
  onReset: () => void;
  totalQuantity: number;
  canResetQuantities: boolean;
}

const ReservationActions = ({
  onReserve,
  onReset,
  totalQuantity,
  canResetQuantities,
}: ReservationActionsProps) => {
  console.log('ReservationActions rendered with totalQuantity:', totalQuantity);
  console.log('canResetQuantities:', canResetQuantities);
  
  return (
    <div className="flex gap-2">
      <Button
        size="default"
        onClick={() => {
          console.log('Reserve button clicked with totalQuantity:', totalQuantity);
          onReserve();
        }}
        disabled={totalQuantity === 0}
        className="whitespace-nowrap"
      >
        <Calendar className="mr-2 h-4 w-4" />
        Je réserve ({totalQuantity} produits)
      </Button>
      <Button
        variant="outline"
        size="default"
        onClick={() => {
          console.log('Reset button clicked');
          onReset();
        }}
        className="whitespace-nowrap"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Réinitialiser
      </Button>
    </div>
  );
};

export default ReservationActions;