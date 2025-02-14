import { useState, useMemo, useCallback } from "react";
import { Product } from "@/utils/types";
import { useProducts } from "@/hooks/useProducts";
import { useProductMutations } from "@/hooks/useProductMutations";
import { useReservations } from "@/hooks/useReservations";
import { useToast } from "@/hooks/use-toast";

export const useProductState = (userRole: string | null, brand: string) => {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { data: products = [], isLoading: isProductsLoading } = useProducts();
  const { addProductMutation, updateProductMutation, deleteProductMutation } = useProductMutations();
  const { createReservation } = useReservations();

  const handleQuantityChange = useCallback((reference: string, newQuantity: string) => {
    const cleanValue = newQuantity.replace(/^0+/, '') || "0";
    const quantity = Math.max(0, parseInt(cleanValue));
    
    setQuantities(prev => ({
      ...prev,
      [reference]: quantity
    }));
  }, []);

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

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (userRole !== 'superadmin' && product.brand !== brand) {
        return false;
      }

      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      
      const name = String(product.name || '').toLowerCase();
      const reference = String(product.reference || '').toLowerCase();
      
      return name.includes(query) || reference.includes(query);
    });
  }, [products, searchQuery, brand, userRole]);

  const totalQuantity = useMemo(() => {
    return Object.values(quantities).reduce((acc, quantity) => acc + quantity, 0);
  }, [quantities]);

  const handleReserveAll = useCallback(() => {
    const productsToReserve = filteredProducts
      .filter(product => quantities[product.reference] > 0)
      .map(product => ({
        ...product,
        initial_quantity: quantities[product.reference]
      }));
    
    if (productsToReserve.length === 0) {
      toast({
        title: "Aucun produit sélectionné",
        description: "Veuillez sélectionner au moins un produit à réserver.",
        variant: "destructive"
      });
      return;
    }

    createReservation.mutate(productsToReserve, {
      onSuccess: () => setQuantities({})
    });
  }, [createReservation, filteredProducts, quantities, toast]);

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
    deleteProductMutation,
    isReservationLoading: createReservation.isPending
  };
};