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
  const [productQuantities, setProductQuantities] = useState<{ [key: string]: number }>({});

  const { data: products = [] } = useProducts();
  const { addProductMutation, updateProductMutation, deleteProductMutation } = useProductMutations();
  const { addReservationMutation } = useReservationMutation();

  const handleQuantityChange = (reference: string, newQuantity: string) => {
    console.log(`Updating quantity for ${reference} to ${newQuantity}`);
    const quantity = parseInt(newQuantity) || 0;
    
    setProductQuantities(prev => ({
      ...prev,
      [reference]: quantity
    }));

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
      const quantity = parseInt(product.initial_quantity?.toString() || '0');
      return acc + (isNaN(quantity) || quantity < 0 ? 0 : quantity);
    }, 0);
    console.log('Calculated total quantity:', total);
    return total;
  }, [filteredProducts]);

  const handleReserveAll = () => {
    console.log('Starting reservation process');
    const productsToReserve = filteredProducts.filter(product => 
      Number(product.initial_quantity) > 0
    );
    
    console.log('Products to reserve:', productsToReserve);
    
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