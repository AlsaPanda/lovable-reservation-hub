import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/utils/types";
import { useToast } from "@/components/ui/use-toast";

export const useProductMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      const { error } = await supabase
        .from('products')
        .insert({
          reference: product.reference,
          name: product.name,
          description: product.description,
          initial_quantity: product.initial_quantity,
          image_url: product.image_url
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté avec succès.",
      });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      const { error } = await supabase
        .from('products')
        .update({
          reference: product.reference,
          name: product.name,
          description: product.description,
          initial_quantity: product.initial_quantity,
          image_url: product.image_url
        })
        .eq('reference', product.reference);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès.",
      });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (reference: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('reference', reference);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
    }
  });

  return {
    addProductMutation,
    updateProductMutation,
    deleteProductMutation
  };
};