import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Reservation } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";

export const useReservations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();
  const { userRole } = useUserProfile();

  const { data: reservations = [], isLoading, error } = useQuery({
    queryKey: ['reservations', userRole, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      try {
        // First, fetch reservations with minimal fields
        const { data: reservationsData, error: reservationsError } = await supabase
          .from('reservations')
          .select('id, product_id, store_name, quantity, reservation_date')
          .order('reservation_date', { ascending: false });

        if (reservationsError) throw reservationsError;
        if (!reservationsData) return [];

        // Then, fetch all related products in a single query
        const productIds = [...new Set(reservationsData.map(r => r.product_id))];
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, name, image_url')
          .in('id', productIds);

        if (productsError) throw productsError;

        // Merge product data with reservations
        return reservationsData.map(reservation => ({
          ...reservation,
          product: products?.find(p => p.id === reservation.product_id) || null
        }));
      } catch (error: any) {
        console.error('Error fetching reservations:', error);
        throw error;
      }
    },
    enabled: !!session?.user?.id && !!userRole
  });

  const updateReservation = useMutation({
    mutationFn: async (updatedReservation: Partial<Reservation>) => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('reservations')
        .update({
          quantity: updatedReservation.quantity,
          reservation_date: updatedReservation.reservation_date
        })
        .eq('id', updatedReservation.id)
        .select('id')
        .maybeSingle();

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
    onError: (error: any) => {
      console.error("Update reservation error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive"
      });
    }
  });

  const deleteReservation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Réservation supprimée",
        description: "La réservation a été supprimée avec succès.",
      });
    },
    onError: (error: any) => {
      console.error("Delete reservation error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression.",
        variant: "destructive"
      });
    }
  });

  return {
    reservations,
    isLoading,
    error,
    updateReservation,
    deleteReservation
  };
};