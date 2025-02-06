import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Reservation, Product } from "@/utils/types";
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
      if (!session?.user?.id || !storeName) return [];
      
      try {
        console.log("Fetching reservations for store:", storeName);
        const { data, error } = await supabase
          .rpc('get_store_reservations', {
            store_name_param: storeName
          });

        if (error) {
          console.error('Error fetching reservations:', error);
          throw error;
        }

        console.log("Fetched reservations:", data);
        return data as Reservation[];
      } catch (error) {
        console.error('Error in fetchReservations:', error);
        throw error;
      }
    },
    enabled: !!session?.user?.id && !!userRole && !!storeName,
    staleTime: 1000 * 60,
  });

  const createReservation = useMutation({
    mutationFn: async (productsToReserve: Product[]) => {
      if (!session?.user?.id || !storeName) {
        throw new Error('User not authenticated or store not found');
      }

      const validProducts = productsToReserve.filter(product => product.initial_quantity > 0);
      
      if (validProducts.length === 0) {
        throw new Error('No valid products to reserve');
      }

      console.log("Starting reservation process for products:", validProducts);

      const createdReservations = [];
      for (const product of validProducts) {
        console.log(`Creating reservation for product ${product.id} for store ${storeName}`);
        
        const { data, error } = await supabase
          .from('reservations')
          .insert({
            product_id: product.id,
            store_name: storeName,
            quantity: product.initial_quantity,
            product_name: product.name
          })
          .select('id')
          .single();

        if (error) {
          console.error(`Error creating reservation for product ${product.id}:`, error);
          throw error;
        }
        
        console.log(`Successfully created reservation for product ${product.id}:`, data);
        createdReservations.push(data);
      }

      return createdReservations;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Réservation créée",
        description: "La réservation a été créée avec succès.",
      });
    },
    onError: (error: any) => {
      console.error("Create reservation error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la réservation.",
        variant: "destructive"
      });
    }
  });

  const updateReservation = useMutation({
    mutationFn: async (updatedReservation: Partial<Reservation>) => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .rpc('update_reservation', {
          reservation_id: updatedReservation.id,
          new_quantity: updatedReservation.quantity,
          new_date: updatedReservation.reservation_date
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Réservation mise à jour",
        description: "La réservation a été mise à jour avec succès.",
      });
    }
  });

  const deleteReservation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.id || !storeName) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .rpc('delete_reservation', {
          reservation_id: id
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Réservation supprimée",
        description: "La réservation a été supprimée avec succès.",
      });
    }
  });

  return {
    reservations,
    isLoading,
    error,
    createReservation,
    updateReservation,
    deleteReservation
  };
};