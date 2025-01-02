import { useState } from "react";
import { Product } from "@/utils/types";
import { useProductMutations } from "@/hooks/useProductMutations";
import { useReservationMutation } from "@/hooks/useReservationMutation";
import { useToast } from "@/hooks/use-toast";

export const useProductState = (userRole: string | null, brand: string) => {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  
  const { addProductMutation, updateProductMutation, deleteProductMutation } = useProductMutations();
  const { addReservationMutation } = useReservationMutation();

  const handleReserveAll = (products: Product[], quantities: Record<string, number>) => {
    console.log('[Products] Starting reservation process');
    const productsToReserve = products
      .filter(product => quantities[product.reference] > 0)
      .map(product => ({
        ...product,
        initial_quantity: quantities[product.reference]
      }));
    
    console.log('[Products] Products to reserve:', productsToReserve);
    
    if (productsToReserve.length === 0) {
      toast({
        title: "Aucun produit sélectionné",
        description: "Veuillez sélectionner au moins un produit à réserver.",
        variant: "destructive"
      });
      return;
    }

    addReservationMutation.mutate(productsToReserve);
  };

  return {
    editingProduct,
    setEditingProduct,
    open,
    setOpen,
    handleReserveAll,
    deleteProductMutation
  };
};