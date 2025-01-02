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

export const useReservations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();
  const { userRole } = useUserProfile();

  const { data: reservations = [], isLoading, error } = useQuery({
    queryKey: ['reservations', userRole, session?.user?.id],
    queryFn: async () => {
      console.log('Fetching reservations for user:', session?.user?.id);
      if (!session?.user?.id) {
        console.log('No user session found');
        return [];
      }
      const isSuperAdmin = userRole === 'superadmin';
      console.log('User is superadmin:', isSuperAdmin);
      const result = await fetchReservations(isSuperAdmin ? null : session.user.id, isSuperAdmin);
      console.log('Fetched reservations:', result);
      return result;
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

  if (error) {
    console.error("Reservations query error:", error);
  }

  return {
    reservations,
    isLoading,
    error,
    updateReservation,
    deleteReservation
  };
};