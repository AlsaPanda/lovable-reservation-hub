import { useState } from "react";
import { Product } from "@/utils/types";
import { useProducts } from "@/hooks/useProducts";
import { useProductMutations } from "@/hooks/useProductMutations";
import { useReservationMutation } from "@/hooks/useReservationMutation";
import { useToast } from "@/hooks/use-toast";
import { useProductQuantities } from "./useProductQuantities";
import { useProductFilters } from "./useProductFilters";

export const useProductState = (userRole: string | null, brand: string) => {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const { data: products = [], isLoading: isProductsLoading } = useProducts();
  const { addProductMutation, updateProductMutation, deleteProductMutation } = useProductMutations();
  const { addReservationMutation } = useReservationMutation();
  
  const { quantities, handleQuantityChange, totalQuantity } = useProductQuantities();
  const { searchQuery, setSearchQuery, filteredProducts } = useProductFilters(products, userRole, brand);

  const handleAddProduct = async (product: Product) => {
    try {
      await addProductMutation.mutateAsync(product);
      setOpen(false);
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit.",
      });
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      await updateProductMutation.mutateAsync(product);
      setEditingProduct(null);
      setOpen(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le produit.",
      });
    }
  };

  const handleReserveAll = () => {
    console.log('[Products] Starting reservation process');
    const productsToReserve = filteredProducts
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
    searchQuery,
    setSearchQuery,
    quantities,
    handleQuantityChange,
    handleAddProduct,
    handleUpdateProduct,
    filteredProducts,
    totalQuantity,
    handleReserveAll,
    isProductsLoading,
    deleteProductMutation
  };
};