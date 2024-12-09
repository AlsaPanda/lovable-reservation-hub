import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/utils/types";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

export const useReservationMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();

  const addReservationMutation = useMutation({
    mutationFn: async (productsToReserve: Product[]) => {
      console.log('Starting reservation mutation with products:', productsToReserve);
      
      const reservations = productsToReserve
        .filter(product => product.initial_quantity > 0)
        .map(product => ({
          product_id: product.id,
          quantity: product.initial_quantity,
          store_name: session?.user?.id,
          reservation_date: new Date().toISOString()
        }));

      console.log('Processed reservations to insert:', reservations);

      if (reservations.length === 0) {
        console.log('No valid reservations to process');
        throw new Error('Aucun produit à réserver');
      }

      const { error } = await supabase
        .from('reservations')
        .insert(reservations);
      
      if (error) {
        console.error('Error inserting reservations:', error);
        throw error;
      }

      // Reset quantities after successful reservation
      const { error: resetError } = await supabase.rpc('reset_all_quantities');
      
      if (resetError) {
        console.error('Error resetting quantities:', resetError);
        throw resetError;
      }
    },
    onSuccess: () => {
      console.log('Reservation mutation succeeded, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Réservations ajoutées",
        description: "Vos réservations ont été ajoutées avec succès.",
      });
    },
    onError: (error) => {
      console.error('Reservation mutation failed:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la réservation.",
        variant: "destructive"
      });
    }
  });

  return { addReservationMutation };
};