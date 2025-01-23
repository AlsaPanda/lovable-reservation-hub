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
  const { userRole, storeName } = useUserProfile();

  const { data: reservations = [], isLoading, error } = useQuery({
    queryKey: ['reservations', userRole, session?.user?.id, storeName],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      try {
        // First, get the basic reservation data
        let query = supabase
          .from('reservations')
          .select(`
            id,
            product_id,
            store_name,
            quantity,
            reservation_date,
            created_at,
            updated_at,
            product_name
          `)
          .order('reservation_date', { ascending: false });

        if (userRole !== 'superadmin') {
          query = query.eq('store_name', storeName);
        }

        const { data: reservationsData, error: reservationsError } = await query;
        if (reservationsError) throw reservationsError;

        // Then, get the product details separately
        const productIds = [...new Set(reservationsData.map(r => r.product_id))];
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        if (productsError) throw productsError;

        // Map products to reservations
        const reservationsWithProducts = reservationsData.map(reservation => ({
          ...reservation,
          product: productsData.find(p => p.id === reservation.product_id) || null
        }));

        return reservationsWithProducts as Reservation[];
      } catch (error) {
        console.error('Error fetching reservations:', error);
        throw error;
      }
    },
    enabled: !!session?.user?.id && !!userRole && !!storeName
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
        .select()
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
      return id;
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