import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface StoreOrder {
  store_name: string;
  store_id: string;
  total_reservations: number;
  total_products: number;
  last_reservation: string;
}

export const useStoreOrders = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['store-orders'],
    queryFn: async () => {
      try {
        // First, get all reservations
        const { data: reservations, error: reservationsError } = await supabase
          .from('reservations')
          .select(`
            store_name,
            quantity,
            reservation_date
          `)
          .order('reservation_date', { ascending: false });

        if (reservationsError) throw reservationsError;

        // Get all profiles to map store IDs, using correct filter syntax
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('store_name, store_id')
          .not('store_id', 'is', null);

        if (profilesError) throw profilesError;

        // Create a mapping of store_name to store_id
        const storeIdMap = profiles.reduce((acc: { [key: string]: string }, profile) => {
          if (profile.store_name && profile.store_id) {
            acc[profile.store_name] = profile.store_id;
          }
          return acc;
        }, {});

        // Process reservations to create store orders
        const ordersByStore = reservations.reduce((acc: { [key: string]: StoreOrder }, curr) => {
          if (!acc[curr.store_name]) {
            acc[curr.store_name] = {
              store_name: curr.store_name,
              store_id: storeIdMap[curr.store_name] || 'N/A',
              total_reservations: 0,
              total_products: 0,
              last_reservation: curr.reservation_date
            };
          }
          acc[curr.store_name].total_reservations += 1;
          acc[curr.store_name].total_products += curr.quantity;
          return acc;
        }, {});

        return Object.values(ordersByStore);
      } catch (error) {
        console.error('Error fetching store orders:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les commandes des magasins"
        });
        throw error;
      }
    }
  });
};