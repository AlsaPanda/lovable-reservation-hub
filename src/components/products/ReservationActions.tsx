import { Button } from "@/components/ui/button";
import { Calendar, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="default"
            disabled={totalQuantity === 0}
            className="whitespace-nowrap"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Je réserve ({totalQuantity} produits)
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la réservation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir réserver ces {totalQuantity} produits ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={onReserve}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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