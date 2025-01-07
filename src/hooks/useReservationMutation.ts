import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";

export const useReservationMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();
  const navigate = useNavigate();

  const addReservationMutation = useMutation({
    mutationFn: async (productsToReserve: Product[]) => {
      console.log('Starting reservation mutation with products:', productsToReserve);
      
      if (!session?.user?.id) {
        console.error('No user session found');
        throw new Error('Vous devez être connecté pour effectuer une réservation');
      }

      // First, get the user's store_name from their profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('store_name')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        if (profileError.message?.includes('JWT')) {
          navigate('/login');
          throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
        }
        throw new Error('Erreur lors de la récupération du profil');
      }

      if (!profileData?.store_name) {
        console.error('No store_name found in profile');
        throw new Error('Impossible de trouver le nom du magasin');
      }

      console.log('Retrieved store_name from profile:', profileData.store_name);

      const reservations = productsToReserve
        .filter(product => product.initial_quantity > 0)
        .map(product => ({
          product_id: product.id,
          product_name: product.name,
          quantity: product.initial_quantity,
          store_name: profileData.store_name,
          reservation_date: new Date().toISOString()
        }));

      console.log('Processed reservations to insert:', reservations);

      if (reservations.length === 0) {
        console.log('No valid reservations to process');
        throw new Error('Aucun produit à réserver');
      }

      try {
        console.log('Attempting to insert reservations...');
        const { error: insertError } = await supabase
          .from('reservations')
          .insert(reservations);
        
        if (insertError) {
          console.error('Error inserting reservations:', insertError);
          throw insertError;
        }
        console.log('Reservations inserted successfully');

        console.log('Attempting to reset quantities...');
        const { error: resetError } = await supabase.rpc('reset_all_quantities');
        
        if (resetError) {
          console.error('Error resetting quantities:', resetError);
          throw resetError;
        }
        console.log('Quantities reset successfully');

      } catch (error: any) {
        console.error('Error in reservation process:', error);
        if (error.message?.includes('JWT')) {
          navigate('/login');
          throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
        }
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Reservation mutation succeeded, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Réservations ajoutées",
        description: "Vos réservations ont été ajoutées avec succès.",
      });
    },
    onError: (error: any) => {
      console.error('Reservation mutation failed:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la réservation.",
        variant: "destructive"
      });
    }
  });

  return { addReservationMutation };
};