import { useUserProfile } from "@/hooks/useUserProfile";
import { useProductFilters } from "@/hooks/product/useProductFilters";
import { useProductState } from "@/hooks/product/useProductState";
import ProductGrid from "@/components/products/ProductGrid";
import ProductsSkeleton from "@/components/products/ProductsSkeleton";
import ProductsHeader from "@/components/products/ProductsHeader";
import { useProductQuantities } from "@/hooks/product/useProductQuantities";

const Products = () => {
  const { userRole, brand, isLoading: isProfileLoading } = useUserProfile();
  
  const {
    products,
    isLoading: isProductsLoading,
    deleteProductMutation
  } = useProductState(userRole, brand);

  const {
    searchQuery,
    setSearchQuery,
    filteredProducts
  } = useProductFilters(products, userRole, brand);

  const {
    quantities,
    handleQuantityChange,
    handleEdit,
    handleDelete
  } = useProductQuantities(deleteProductMutation);

  console.log("[Products] Current search query:", searchQuery);
  console.log("[Products] Products count:", products?.length);
  console.log("[Products] Filtered products count:", filteredProducts?.length);

  if (isProfileLoading || isProductsLoading) {
    return <ProductsSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductsHeader
        userRole={userRole}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
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