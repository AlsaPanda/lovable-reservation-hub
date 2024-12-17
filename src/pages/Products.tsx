import { useState, useMemo, useCallback } from "react";
import NavBar from "@/components/NavBar";
import { Product } from "@/utils/types";
import ProductForm from "@/components/products/ProductForm";
import ProductGrid from "@/components/products/ProductGrid";
import ProductsHeader from "@/components/products/ProductsHeader";
import PageHeader from "@/components/products/PageHeader";
import ProductsHeaderContent from "@/components/products/ProductsHeaderContent";
import { useProducts } from "@/hooks/useProducts";
import { useProductMutations } from "@/hooks/useProductMutations";
import { useReservationMutation } from "@/hooks/useReservationMutation";
import { useToast } from "@/components/ui/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";

const Products = () => {
  const { toast } = useToast();
  const { userRole, brand } = useUserProfile();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { data: products = [] } = useProducts();
  const { addProductMutation, updateProductMutation, deleteProductMutation } = useProductMutations();
  const { addReservationMutation } = useReservationMutation();

  const handleQuantityChange = useCallback((reference: string, newQuantity: string) => {
    console.log(`[Products] handleQuantityChange called for ${reference} with value:`, newQuantity);
    
    // Parse and clean input value
    const cleanValue = newQuantity.replace(/^0+/, '') || "0";
    const quantity = Math.max(0, parseInt(cleanValue));
    
    console.log(`[Products] Parsed and cleaned quantity:`, quantity);
    
    setQuantities(prev => ({
      ...prev,
      [reference]: quantity
    }));
  }, []);

  const handleAddProduct = (data: Product) => {
    // Add brand to the product data
    const productWithBrand = {
      ...data,
      brand: userRole === 'superadmin' ? data.brand : brand
    };
    addProductMutation.mutate(productWithBrand);
    setOpen(false);
  };

  const handleUpdateProduct = (data: Product) => {
    // Ensure brand is preserved when updating
    const productWithBrand = {
      ...data,
      brand: userRole === 'superadmin' ? data.brand : brand
    };
    updateProductMutation.mutate(productWithBrand);
    setOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Filter by brand unless user is superadmin
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

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader title="Réservation des produits" />
        <ProductsHeaderContent />

        <ProductsHeader
          onOpenDialog={() => setOpen(true)}
          onProductsImported={(products) => {
            // Add brand to imported products
            const productsWithBrand = products.map(product => ({
              ...product,
              brand: userRole === 'superadmin' ? (product.brand || 'schmidt') : brand
            }));
            productsWithBrand.forEach(product => {
              addProductMutation.mutate(product);
            });
          }}
          onSearch={setSearchQuery}
          onReserve={handleReserveAll}
          totalQuantity={totalQuantity}
        />

        <ProductGrid
          products={filteredProducts}
          quantities={quantities}
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
          userRole={userRole}
          brand={brand}
        />
      </div>
    </>
  );
};

export default Products;