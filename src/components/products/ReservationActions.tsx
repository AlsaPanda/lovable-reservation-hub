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
  canResetQuantities 
}: ReservationActionsProps) => {
  return (
    <div className="flex gap-2">
      {canResetQuantities && (
        <Button
          variant="outline"
          onClick={onReset}
          className="whitespace-nowrap"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
};

export default ReservationActions;