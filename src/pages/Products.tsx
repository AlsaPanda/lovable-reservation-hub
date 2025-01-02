import { useUserProfile } from "@/hooks/useUserProfile";
import { useProductFilters } from "@/hooks/product/useProductFilters";
import { useProductState } from "@/hooks/product/useProductState";
import ProductGrid from "@/components/products/ProductGrid";
import ProductsSkeleton from "@/components/products/ProductsSkeleton";
import ProductsHeader from "@/components/products/ProductsHeader";
import ProductsHeaderContent from "@/components/products/ProductsHeaderContent";
import { useProductQuantities } from "@/hooks/product/useProductQuantities";
import { Product } from "@/utils/types";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";

const Products = () => {
  const { userRole, brand, isLoading: isProfileLoading } = useUserProfile();
  const { data: products, isLoading: isProductsLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  
  const {
    editingProduct,
    setEditingProduct,
    open,
    setOpen,
    handleReserveAll,
    deleteProductMutation
  } = useProductState(userRole, brand);

  const {
    filteredProducts
  } = useProductFilters(products, userRole, brand, searchQuery);

  const {
    quantities,
    handleQuantityChange,
    totalQuantity
  } = useProductQuantities();

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setOpen(true);
  };

  const handleDelete = (reference: string) => {
    deleteProductMutation.mutate(reference);
  };

  const handleSearch = (value: string) => {
    console.log("[Products] Search query updated:", value);
    setSearchQuery(value);
  };

  console.log("[Products] Current search query:", searchQuery);
  console.log("[Products] Filtered products count:", filteredProducts?.length);

  if (isProfileLoading || isProductsLoading) {
    return <ProductsSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductsHeaderContent />
      <ProductsHeader
        onOpenDialog={() => setOpen(true)}
        onProductsImported={() => {}}
        onSearch={handleSearch}
        onReserve={() => handleReserveAll(filteredProducts, quantities)}
        totalQuantity={totalQuantity}
      />
      <ProductGrid
        products={filteredProducts}
        quantities={quantities}
        onQuantityChange={handleQuantityChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Products;