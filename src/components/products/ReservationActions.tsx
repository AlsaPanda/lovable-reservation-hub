/**
 * ReservationActions Component
 * 
 * Handles the reservation confirmation dialog and actions for products.
 * Displays a scrollable list of products to be reserved and manages the reservation process.
 */

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Product } from "@/utils/types";

interface ReservationActionsProps {
  onReserve: () => void;
  onReset: () => void;
  totalQuantity: number;
  canResetQuantities: boolean;
  isLoading?: boolean;
  productsToReserve: Product[];
}

const ReservationActions = ({
  onReserve,
  onReset,
  totalQuantity,
  canResetQuantities,
  isLoading = false,
  productsToReserve,
}: ReservationActionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
              Vous allez réserver les produits suivants :
            </AlertDialogDescription>
          </AlertDialogHeader>

          <ScrollArea className="h-[200px] rounded-md border p-4">
            <div className="space-y-2">
              {productsToReserve.map((product) => (
                <div 
                  key={product.reference}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Réf: {product.reference}</p>
                  </div>
                  <span className="font-medium">
                    Qté: {product.initial_quantity}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>

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
        onClick={onReset}
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