import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStoreDetails = (storeName: string | null) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['store-details', storeName],
    enabled: !!storeName,
    queryFn: async () => {
      if (!storeName) return [];

      try {
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
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les détails du magasin"
          });
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in store details query:', error);
        throw error;
      }
    }
  });
};