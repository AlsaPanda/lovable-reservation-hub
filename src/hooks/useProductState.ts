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
    console.log('[Products] Filtering products with query:', searchQuery);
    console.log('[Products] Total products before filtering:', products.length);
    
    return products.filter(product => {
      // First filter by brand if not superadmin
      if (userRole !== 'superadmin' && product.brand !== brand) {
        return false;
      }

      // Then apply search filter if there's a query
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      
      const name = (product.name || '').toLowerCase();
      const reference = (product.reference || '').toLowerCase();
      
      const matches = name.includes(query) || reference.includes(query);
      console.log(`[Products] Product ${product.reference} matches search: ${matches}`);
      return matches;
    });
  }, [products, searchQuery, brand, userRole]);

  const totalQuantity = useMemo(() => {
    const total = Object.values(quantities).reduce((acc, quantity) => acc + quantity, 0);
    console.log('[Products] Calculated total quantity:', total);
    return total;
  }, [quantities]);

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