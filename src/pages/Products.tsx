import { useState, useMemo } from "react";
import NavBar from "@/components/NavBar";
import { Product } from "@/utils/types";
import ProductForm from "@/components/products/ProductForm";
import ProductGrid from "@/components/products/ProductGrid";
import ProductsHeader from "@/components/products/ProductsHeader";
import PageHeader from "@/components/products/PageHeader";
import { useProducts } from "@/hooks/useProducts";
import { useProductMutations } from "@/hooks/useProductMutations";
import { useReservationMutation } from "@/hooks/useReservationMutation";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const Products = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [] } = useProducts();
  const { addProductMutation, updateProductMutation, deleteProductMutation } = useProductMutations();
  const { addReservationMutation } = useReservationMutation();

  const handleQuantityChange = (reference: string, newQuantity: string) => {
    console.log(`[Products] handleQuantityChange called with reference: ${reference}, newQuantity: ${newQuantity}`);
    
    // Convert to number and ensure it's not negative
    const quantity = Math.max(0, parseInt(newQuantity) || 0);
    console.log(`[Products] Parsed quantity: ${quantity}`);
    
    // Update products directly
    const updatedProducts = products.map(p => {
      if (p.reference === reference) {
        console.log(`[Products] Updating product ${reference} from ${p.initial_quantity} to ${quantity}`);
        return { ...p, initial_quantity: quantity };
      }
      return p;
    });

    // Update cache
    queryClient.setQueryData(['products'], updatedProducts);
  };

  const handleAddProduct = (data: Product) => {
    addProductMutation.mutate(data);
    setOpen(false);
  };

  const handleUpdateProduct = (data: Product) => {
    updateProductMutation.mutate(data);
    setOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      
      const name = String(product.name || '').toLowerCase();
      const reference = String(product.reference || '').toLowerCase();
      
      return name.includes(query) || reference.includes(query);
    });
  }, [products, searchQuery]);

  const totalQuantity = useMemo(() => {
    const total = filteredProducts.reduce((acc, product) => {
      const quantity = product.initial_quantity || 0;
      return acc + quantity;
    }, 0);
    console.log('[Products] Calculated total quantity:', total);
    return total;
  }, [filteredProducts]);

  const handleReserveAll = () => {
    console.log('[Products] Starting reservation process');
    const productsToReserve = filteredProducts.filter(product => 
      (product.initial_quantity || 0) > 0
    );
    
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

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader title="Réservation des produits" />

        <ProductsHeader
          onOpenDialog={() => setOpen(true)}
          onProductsImported={(products) => {
            products.forEach(product => {
              addProductMutation.mutate(product);
            });
          }}
          onSearch={setSearchQuery}
          onReserve={handleReserveAll}
          totalQuantity={totalQuantity}
        />

        <ProductGrid
          products={filteredProducts}
          onQuantityChange={handleQuantityChange}
          onEdit={(product) => {
            setEditingProduct(product);
            setOpen(true);
          }}
          onDelete={(reference) => deleteProductMutation.mutate(reference)}
        />

        <ProductForm 
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          editingProduct={editingProduct}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    </>
  );
};

export default Products;