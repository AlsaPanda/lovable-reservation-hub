import { useState, useMemo, useCallback } from "react";
import { Product } from "@/utils/types";
import { useProducts } from "@/hooks/useProducts";
import { useProductMutations } from "@/hooks/useProductMutations";
import { useReservationMutation } from "@/hooks/useReservationMutation";
import { useToast } from "@/hooks/use-toast";

export const useProductState = (userRole: string | null, brand: string) => {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { data: products = [], isLoading: isProductsLoading } = useProducts();
  const { addProductMutation, updateProductMutation, deleteProductMutation } = useProductMutations();
  const { addReservationMutation } = useReservationMutation();

  const handleQuantityChange = useCallback((reference: string, newQuantity: string) => {
    console.log(`[Products] handleQuantityChange called for ${reference} with value:`, newQuantity);
    
    const cleanValue = newQuantity.replace(/^0+/, '') || "0";
    const quantity = Math.max(0, parseInt(cleanValue));
    
    console.log(`[Products] Parsed and cleaned quantity:`, quantity);
    
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
    return products
      .filter(product => {
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
    const total = Object.values(quantities).reduce((acc, quantity) => acc + quantity, 0);
    console.log('[Products] Calculated total quantity:', total);
    return total;
  }, [quantities]);

  const handleReserveAll = useCallback(() => {
    console.log('[Products] Starting reservation process');
    if (addReservationMutation.isPending) {
      console.log('[Products] Reservation already in progress, skipping');
      return;
    }

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

    addReservationMutation.mutate(productsToReserve, {
      onSuccess: () => {
        setQuantities({});
      }
    });
  }, [addReservationMutation, filteredProducts, quantities, toast]);

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
    isReservationLoading: addReservationMutation.isPending
  };
};