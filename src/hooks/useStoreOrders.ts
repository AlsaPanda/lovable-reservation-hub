import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStoreOrders = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['store-orders'],
    queryFn: async () => {
      try {
        // Fetch only the necessary fields and avoid the recursive trigger
        const { data: reservations, error: reservationsError } = await supabase
          .from('reservations')
          .select(`
            id,
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

        // Group reservations by store without complex joins
        const ordersByStore = (reservations || []).reduce((acc: any[], reservation) => {
          const existingStore = acc.find(store => store.store_name === reservation.store_name);
          
          if (existingStore) {
            existingStore.total_reservations++;
            existingStore.total_products += reservation.quantity;
            if (new Date(reservation.reservation_date) > new Date(existingStore.last_reservation)) {
              existingStore.last_reservation = reservation.reservation_date;
            }
          } else {
            acc.push({
              store_name: reservation.store_name,
              store_id: reservation.store_name, // Using store_name as store_id for now
              total_reservations: 1,
              total_products: reservation.quantity,
              last_reservation: reservation.reservation_date
            });
          }
          
          return acc;
        }, []);

        // Sort stores by their most recent reservation
        return ordersByStore.sort((a, b) => 
          new Date(b.last_reservation).getTime() - new Date(a.last_reservation).getTime()
        );
      } catch (error: any) {
        console.error('Error in store orders query:', error);
        throw error;
      }
    }
  });
};