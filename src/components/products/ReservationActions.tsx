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
import { useState, useEffect } from "react";
import { Product } from "@/utils/types";
import ProductImage from "./ProductImage";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

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
  const session = useSession();
  
  useEffect(() => {
    const fetchExistingReservations = async () => {
      if (!session?.user?.id) return;

      try {
        // Get user's store_name
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('store_name')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        if (!profileData?.store_name) {
          console.error('No store_name found');
          return;
        }

        // Optimized query to get existing reservations
        const { data: reservations, error: reservationsError } = await supabase
          .from('reservations')
          .select('product_id')
          .eq('store_name', profileData.store_name)
          .is('product', null); // Only get reservations without product JSON to avoid recursion

        if (reservationsError) {
          console.error('Error fetching reservations:', reservationsError);
          return;
        }

        if (reservations) {
          setExistingReservations(reservations.map(r => r.product_id));
        }
      } catch (error) {
        console.error('Error in fetchExistingReservations:', error);
      }
    };

    fetchExistingReservations();
  }, [session?.user?.id]);

  const handleReserve = () => {
    if (isLoading) return;
    onReserve();
    setIsDialogOpen(false);
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
                    {existingReservations.includes(product.id) && (
                      <p className="text-sm text-destructive font-medium mt-1">
                        ⚠️ Ce produit a déjà été réservé
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
        disabled={!canResetQuantities || isLoading}
        className="whitespace-nowrap"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Réinitialiser
      </Button>
    </div>
  );
};

export default ReservationActions;