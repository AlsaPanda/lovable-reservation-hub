import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reservation } from "@/utils/types";
import { useToast } from "@/components/ui/use-toast";

export const useReservations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          product:products(*)
        `);
      
      if (error) throw error;
      return data as Reservation[];
    }
  });

  const updateReservation = useMutation({
    mutationFn: async (updatedReservation: Partial<Reservation>) => {
      if (!updatedReservation.id) throw new Error('Missing reservation ID');

      const { data, error } = await supabase
        .from('reservations')
        .update({
          product_id: updatedReservation.product_id,
          store_name: updatedReservation.store_name,
          quantity: updatedReservation.quantity,
          reservation_date: updatedReservation.reservation_date
        })
        .eq('id', updatedReservation.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Réservation mise à jour",
        description: "La réservation a été mise à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteReservation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Réservation supprimée",
        description: "La réservation a été supprimée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    reservations,
    isLoading,
    updateReservation,
    deleteReservation
  };
};