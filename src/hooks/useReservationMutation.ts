import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";

export const useReservationMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { storeName } = useUserProfile();

  const deleteReservation = useMutation({
    mutationFn: async (reservationId: string) => {
      console.log('Attempting to delete reservation:', reservationId);
      
      const { data, error } = await supabase
        .rpc('delete_reservation', { 
          reservation_id: reservationId,
          user_store_name: storeName
        });

      if (error) {
        console.error('Error deleting reservation:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Reservation not found or you do not have permission to delete it');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Réservation supprimée",
        description: "La réservation a été supprimée avec succès",
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
      });
    },
  });

  return {
    deleteReservation,
  };
};