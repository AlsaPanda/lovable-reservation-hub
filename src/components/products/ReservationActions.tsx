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
import { useState } from "react";

interface ReservationActionsProps {
  onReserve: () => void;
  onReset: () => void;
  totalQuantity: number;
  canResetQuantities: boolean;
  isLoading?: boolean;
}

const ReservationActions = ({
  onReserve,
  onReset,
  totalQuantity,
  canResetQuantities,
  isLoading = false,
}: ReservationActionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  console.log('ReservationActions rendered with totalQuantity:', totalQuantity);
  console.log('canResetQuantities:', canResetQuantities);
  console.log('isLoading:', isLoading);
  
  const handleReserve = () => {
    if (isLoading) return;
    onReserve();
    setIsDialogOpen(false);
  };

  return (
    <div className="flex gap-2">
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size="default"
            disabled={totalQuantity === 0 || isLoading}
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
            <AlertDialogAction onClick={handleReserve} disabled={isLoading}>
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
        disabled={isLoading}
        className="whitespace-nowrap"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Réinitialiser
      </Button>
    </div>
  );
};

export default ReservationActions;