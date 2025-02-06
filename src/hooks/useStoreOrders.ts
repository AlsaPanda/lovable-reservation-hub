import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStoreOrders = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['store-orders'],
    queryFn: async () => {
      try {
        // First, get unique store names with their latest reservation date
        const { data: storeOrders, error: storesError } = await supabase
          .from('reservations')
          .select(`
            store_name,
            quantity,
            reservation_date
          `)
          .order('reservation_date', { ascending: false });

        if (storesError) {
          console.error('Error fetching stores:', storesError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les magasins"
          });
          throw storesError;
        }

        // Process the data to get store summaries
        const storeMap = new Map();
        
        storeOrders?.forEach(reservation => {
          if (!storeMap.has(reservation.store_name)) {
            storeMap.set(reservation.store_name, {
              store_name: reservation.store_name,
              store_id: reservation.store_name, // Using store_name as ID
              total_reservations: 1,
              total_products: reservation.quantity,
              last_reservation: reservation.reservation_date
            });
          } else {
            const store = storeMap.get(reservation.store_name);
            store.total_reservations++;
            store.total_products += reservation.quantity;
            if (new Date(reservation.reservation_date) > new Date(store.last_reservation)) {
              store.last_reservation = reservation.reservation_date;
            }
          }
        });

        return Array.from(storeMap.values());
      } catch (error: any) {
        console.error('Error in store orders query:', error);
        throw error;
      }
    }
  });
};