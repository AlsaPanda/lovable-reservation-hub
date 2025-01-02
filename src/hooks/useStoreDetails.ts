import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DetailedReservation {
  id: string;
  product_name: string;
  quantity: number;
  reservation_date: string;
}

export const useStoreDetails = (storeName: string | null) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['store-details', storeName],
    queryFn: async () => {
      if (!storeName) return [];
      
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select(`
            id,
            quantity,
            reservation_date,
            products (
              name
            )
          `)
          .eq('store_name', storeName)
          .order('reservation_date', { ascending: false });

        if (error) throw error;

        return data.map(item => ({
          id: item.id,
          product_name: item.products.name,
          quantity: item.quantity,
          reservation_date: item.reservation_date,
        }));
      } catch (error) {
        console.error('Error fetching store details:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les détails du magasin"
        });
        throw error;
      }
    },
    enabled: !!storeName
  });
};