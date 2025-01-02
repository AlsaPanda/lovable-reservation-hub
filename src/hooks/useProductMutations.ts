import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductInsert, ProductUpdate } from "@/types/products";
import { useToast } from "@/components/ui/use-toast";
import { InsertProduct, UpdateProduct } from "@/types/supabase";

export const useProductMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addProductMutation = useMutation({
    mutationFn: async (product: ProductInsert) => {
      const insertData: InsertProduct = {
        reference: product.reference,
        name: product.name,
        description: product.description,
        initial_quantity: product.initial_quantity,
        image_url: product.image_url,
        purchase_price_ht: product.purchase_price_ht,
        sale_price_ttc: product.sale_price_ttc,
        product_url: product.product_url,
        brand: product.brand || 'schmidt'
      };

      const { error } = await supabase
        .from('products')
        .insert(insertData);
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
    mutationFn: async (product: ProductUpdate) => {
      const updateData: UpdateProduct = {
        reference: product.reference,
        name: product.name,
        description: product.description,
        initial_quantity: product.initial_quantity,
        image_url: product.image_url,
        purchase_price_ht: product.purchase_price_ht,
        sale_price_ttc: product.sale_price_ttc,
        product_url: product.product_url,
        brand: product.brand
      };

      const { error } = await supabase
        .from('products')
        .update(updateData)
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