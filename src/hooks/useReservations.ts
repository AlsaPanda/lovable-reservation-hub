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

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['reservations', userRole, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const isSuperAdmin = userRole === 'superadmin';
      return fetchReservations(session.user.id, isSuperAdmin);
    },
    enabled: !!session?.user?.id
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