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
import ProductImage from "./ProductImage";
import { useToast } from "@/hooks/use-toast";

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
  const [isReserving, setIsReserving] = useState(false);
  const { toast } = useToast();
  
  const handleReserve = async () => {
    if (isLoading || isReserving) {
      console.log('Preventing duplicate reservation - already in progress');
      return;
    }
    
    try {
      console.log('Starting reservation process');
      setIsReserving(true);
      await onReserve();
      setIsDialogOpen(false);
      toast({
        title: "Réservation effectuée",
        description: "Les produits ont été réservés avec succès.",
      });
    } catch (error: any) {
      console.error('Reservation error:', error);
      toast({
        title: "Erreur de réservation",
        description: error.message || "Une erreur est survenue lors de la réservation.",
        variant: "destructive"
      });
    } finally {
      console.log('Reservation process completed');
      setIsReserving(false);
    }
  };

  const truncateText = (text: string, maxLength: number = 35) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Remove duplicate products based on reference
  const uniqueProductsToReserve = productsToReserve.reduce((acc: Product[], current) => {
    const exists = acc.find(item => item.reference === current.reference);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <div className="flex gap-2">
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size="default"
            disabled={totalQuantity === 0 || isLoading || isReserving}
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

          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-4">
              {uniqueProductsToReserve.map((product) => (
                <div 
                  key={product.reference}
                  className="flex items-center gap-4 py-3 border-b last:border-0"
                >
                  <div className="w-20 h-20 flex-shrink-0">
                    <ProductImage 
                      imageUrl={product.image_url} 
                      altText={product.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" title={product.name}>
                      {truncateText(product.name)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Réf: {product.reference}
                    </p>
                  </div>
                  <span className="font-medium whitespace-nowrap">
                    Qté: {product.initial_quantity}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReserving}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReserve} 
              disabled={isLoading || isReserving}
            >
              {isReserving ? 'Réservation...' : 'Confirmer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        variant="outline"
        size="default"
        onClick={onReset}
        disabled={isLoading || isReserving}
        className="whitespace-nowrap"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Réinitialiser
      </Button>
    </div>
  );
};

export default ReservationActions;