import { useState } from "react";
import NavBar from "@/components/NavBar";
import { Product } from "@/utils/types";
import ProductForm from "@/components/products/ProductForm";
import ProductGrid from "@/components/products/ProductGrid";
import ProductsHeader from "@/components/products/ProductsHeader";
import ProductActions from "@/components/products/ProductActions";
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
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 0) return;

    const updatedProducts = products.map(p => 
      p.reference === reference ? { ...p, initial_quantity: quantity } : p
    );
    
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    if (!searchQuery.trim()) return true;
    
    const searchTerm = searchQuery.toLowerCase().trim();
    const name = (product.name || '').toLowerCase();
    const reference = (product.reference || '').toLowerCase();
    
    return name.includes(searchTerm) || reference.includes(searchTerm);
  });

  const handleReserveAll = () => {
    const productsToReserve = filteredProducts.filter(p => {
      return typeof p.initial_quantity === 'number' && p.initial_quantity > 0;
    });
    
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
          onSearch={handleSearch}
          products={filteredProducts}
          onReserve={handleReserveAll}
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

        <ProductActions />

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