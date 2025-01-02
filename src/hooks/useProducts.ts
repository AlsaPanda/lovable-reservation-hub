import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/products";
import { useToast } from "@/hooks/use-toast";
import { ProductResponse } from "@/types/supabase";

export const useProducts = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les produits.",
          });
          throw error;
        }

        return (data as ProductResponse[]).map(product => ({
          ...product,
          brand: product.brand || 'schmidt'
        })) as Product[];
      } catch (error) {
        console.error('Error in useProducts:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la récupération des produits.",
        });
        throw error;
      }
    }
  });
};