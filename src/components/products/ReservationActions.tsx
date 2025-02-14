/**
 * ReservationActions Component
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
import { useState, useEffect } from "react";
import { Product } from "@/utils/types";
import ProductImage from "./ProductImage";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
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
  const [existingReservations, setExistingReservations] = useState<string[]>([]);
  const [isReserving, setIsReserving] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchExistingReservations = async () => {
      if (!session?.user?.id) return;

      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('store_name')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!profileData?.store_name) return;

        const { data: reservations, error } = await supabase
          .rpc('get_store_reservation_products', {
            store_name_param: profileData.store_name
          });

        if (error) {
          console.error('Error fetching reservations:', error);
          return;
        }

        if (reservations) {
          console.log('Existing reservations:', reservations);
          setExistingReservations(reservations.map(r => r.product_id));
        }
      } catch (error) {
        console.error('Error in fetchExistingReservations:', error);
      }
    };

    fetchExistingReservations();
  }, [session?.user?.id]);

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

  // Combine quantities for products with the same reference
  const consolidatedProducts = productsToReserve.reduce((acc: Product[], current) => {
    const existingProduct = acc.find(item => item.reference === current.reference);
    if (existingProduct) {
      // Don't modify the original quantity, just add it for display
      existingProduct.initial_quantity = existingProduct.initial_quantity + current.initial_quantity;
    } else {
      // Create a new object to avoid modifying the original
      acc.push({ ...current });
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
              {consolidatedProducts.map((product) => (
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
                    {existingReservations.includes(product.id) && (
                      <p className="text-sm text-yellow-600 font-medium mt-1">
                        ⚠️ Ce produit a déjà été réservé (réservation additionnelle)
                      </p>
                    )}
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
        disabled={!canResetQuantities || isLoading || isReserving}
        className="whitespace-nowrap"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Réinitialiser
      </Button>
    </div>
  );
};

export default ReservationActions;