import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Reservation } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { 
  fetchReservations, 
  updateReservationInDb, 
  deleteReservationFromDb 
} from "@/services/reservationService";
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
      
      const isSuperAdmin = userRole === 'superadmin';
      const reservationsData = await fetchReservations(session.user.id, isSuperAdmin);
      
      // Fetch product details separately to avoid nested queries
      if (reservationsData && reservationsData.length > 0) {
        const productIds = [...new Set(reservationsData.map(r => r.product_id))];
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        // Merge product data with reservations
        return reservationsData.map(reservation => ({
          ...reservation,
          product: products?.find(p => p.id === reservation.product_id)
        }));
      }
      
      return reservationsData;
    },
    enabled: !!session?.user?.id && !!userRole
  });

  const updateReservation = useMutation({
    mutationFn: async (updatedReservation: Partial<Reservation>) => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      return updateReservationInDb(updatedReservation, session.user.id);
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
      return deleteReservationFromDb(id, session.user.id);
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