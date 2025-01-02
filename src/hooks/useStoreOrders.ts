import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useStoreOrders = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['store-orders'],
    queryFn: async () => {
      try {
        // First fetch reservations
        const { data: reservations, error: reservationsError } = await supabase
          .from('reservations')
          .select(`
            id,
            product_id,
            store_name,
            quantity,
            reservation_date,
            product_name
          `)
          .order('reservation_date', { ascending: false });

        if (reservationsError) {
          console.error('Error fetching reservations:', reservationsError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les réservations"
          });
          throw reservationsError;
        }

        // Get all profiles with store_id
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('store_name, store_id')
          .neq('store_id', null); // Using neq instead of not is null

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les informations des magasins"
          });
          throw profilesError;
        }

        // Create a mapping of store_name to store_id
        const storeIdMap = (profiles || []).reduce((acc: { [key: string]: string }, profile) => {
          if (profile.store_name && profile.store_id) {
            acc[profile.store_name] = profile.store_id;
          }
          return acc;
        }, {});

        // Group reservations by store
        const ordersByStore = (reservations || []).reduce((acc: { [key: string]: any }, reservation) => {
          const storeId = storeIdMap[reservation.store_name];
          if (!acc[reservation.store_name]) {
            acc[reservation.store_name] = {
              store_name: reservation.store_name,
              store_id: storeId,
              reservations: [],
              total_quantity: 0
            };
          }
          
          acc[reservation.store_name].reservations.push(reservation);
          acc[reservation.store_name].total_quantity += reservation.quantity;
          
          return acc;
        }, {});

        return Object.values(ordersByStore);
      } catch (error: any) {
        console.error('Error in store orders query:', error);
        throw error;
      }
    }
  });
};