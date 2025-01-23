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
        console.log('Current user role:', userRole);
        
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
            product_name,
            product:products (
              id,
              reference,
              name,
              description,
              initial_quantity,
              image_url,
              created_at,
              updated_at,
              purchase_price_ht,
              sale_price_ttc,
              product_url,
              brand
            )
          `)
          .order('reservation_date', { ascending: false });

        // If not superadmin, only fetch reservations for the user's store
        if (userRole !== 'superadmin') {
          query = query.eq('store_name', storeName);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching reservations:', error);
          throw error;
        }

        // Transform the data to match the expected format
        const transformedData = data.map(reservation => ({
          ...reservation,
          product: reservation.product ? reservation.product[0] : null
        }));

        return transformedData as Reservation[];
      } catch (error) {
        console.error('Error in useReservations:', error);
        throw error;
      }
    },
    enabled: !!session?.user?.id && !!userRole && !!storeName && window.location.pathname === '/reservations'
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