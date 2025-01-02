import { useUserProfile } from "@/hooks/useUserProfile";
import { useProductFilters } from "@/hooks/product/useProductFilters";
import { useProductState } from "@/hooks/product/useProductState";
import ProductGrid from "@/components/products/ProductGrid";
import ProductsSkeleton from "@/components/products/ProductsSkeleton";
import ProductsHeader from "@/components/products/ProductsHeader";
import { useProductQuantities } from "@/hooks/product/useProductQuantities";
import { Product } from "@/utils/types";

const Products = () => {
  const { userRole, brand, isLoading: isProfileLoading } = useUserProfile();
  
  const {
    editingProduct,
    setEditingProduct,
    open,
    setOpen,
    filteredProducts,
    isProductsLoading,
    deleteProductMutation,
    handleReserveAll
  } = useProductState(userRole, brand);

  const {
    searchQuery,
    setSearchQuery,
  } = useProductFilters(filteredProducts, userRole, brand);

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

  console.log("[Products] Current search query:", searchQuery);
  console.log("[Products] Filtered products count:", filteredProducts?.length);

  if (isProfileLoading || isProductsLoading) {
    return <ProductsSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductsHeader
        onOpenDialog={() => setOpen(true)}
        onProductsImported={() => {}}
        onSearch={setSearchQuery}
        onReserve={handleReserveAll}
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