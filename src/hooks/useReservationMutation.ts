import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

export const useReservationMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();

  const addReservationMutation = useMutation({
    mutationFn: async (productsToReserve: Product[]) => {
      console.log('Starting reservation mutation with products:', productsToReserve);
      
      if (!session?.user?.id) {
        console.error('No user session found');
        throw new Error('Vous devez être connecté pour effectuer une réservation');
      }

      const reservations = productsToReserve
        .filter(product => product.initial_quantity > 0)
        .map(product => ({
          product_id: product.id,
          product_name: product.name, // Add product name to reservation
          quantity: product.initial_quantity,
          store_name: session.user.id,
          reservation_date: new Date().toISOString()
        }));

      console.log('Processed reservations to insert:', reservations);

      if (reservations.length === 0) {
        console.log('No valid reservations to process');
        throw new Error('Aucun produit à réserver');
      }

      try {
        console.log('Attempting to insert reservations...');
        const { error: insertError } = await supabase
          .from('reservations')
          .insert(reservations);
        
        if (insertError) {
          console.error('Error inserting reservations:', insertError);
          throw insertError;
        }
        console.log('Reservations inserted successfully');

        console.log('Attempting to reset quantities...');
        const { error: resetError } = await supabase.rpc('reset_all_quantities');
        
        if (resetError) {
          console.error('Error resetting quantities:', resetError);
          throw resetError;
        }
        console.log('Quantities reset successfully');

      } catch (error) {
        console.error('Error in reservation process:', error);
        throw error;
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
    onError: (error: any) => {
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