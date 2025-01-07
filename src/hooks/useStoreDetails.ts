import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStoreDetails = (storeName: string | null) => {
  return useQuery({
    queryKey: ['store-details', storeName],
    enabled: !!storeName,
    queryFn: async () => {
      if (!storeName) return [];

      const { data, error } = await supabase
        .from('reservations')
        .select(`
          id,
          product_name,
          quantity,
          reservation_date
        `)
        .eq('store_name', storeName)
        .order('reservation_date', { ascending: false });

      if (error) {
        console.error('Error fetching store details:', error);
        throw error;
      }

      return data || [];
    }
  });
};