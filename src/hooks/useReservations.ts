import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reservation } from "@/utils/types";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

export const useReservations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          product:products(*)
        `)
        .eq('store_name', session.user.id)
        .order('reservation_date', { ascending: true })
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Reservation[];
    },
    enabled: !!session?.user?.id
  });

  const updateReservation = useMutation({
    mutationFn: async (updatedReservation: Partial<Reservation>) => {
      console.log("Updating reservation with data:", updatedReservation);
      if (!updatedReservation.id) throw new Error('Missing reservation ID');

      const { data, error } = await supabase
        .from('reservations')
        .update({
          quantity: updatedReservation.quantity,
          reservation_date: updatedReservation.reservation_date
        })
        .eq('id', updatedReservation.id)
        .eq('store_name', session?.user?.id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating reservation:", error);
        throw error;
      }
      console.log("Reservation updated successfully:", data);
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
      console.error("Mutation error:", error);
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
        .eq('id', id)
        .eq('store_name', session?.user?.id);
      
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