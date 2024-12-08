import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/utils/types";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

export const useReservationMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();

  const addReservationMutation = useMutation({
    mutationFn: async (productsToReserve: Product[]) => {
      const reservations = productsToReserve
        .filter(product => product.initial_quantity > 0)
        .map(product => ({
          product_id: product.id,
          quantity: product.initial_quantity,
          store_name: session?.user?.id,
          reservation_date: new Date().toISOString()
        }));

      const { error } = await supabase
        .from('reservations')
        .insert(reservations);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Réservations ajoutées",
        description: "Vos réservations ont été ajoutées avec succès.",
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

  return { addReservationMutation };
};