import NavBar from "@/components/NavBar";
import ProductForm from "@/components/products/ProductForm";
import ProductGrid from "@/components/products/ProductGrid";
import ProductsHeader from "@/components/products/ProductsHeader";
import PageHeader from "@/components/products/PageHeader";
import ProductsHeaderContent from "@/components/products/ProductsHeaderContent";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProductState } from "@/hooks/product/useProductState";
import ProductsSkeleton from "@/components/products/ProductsSkeleton";

const Products = () => {
  const { userRole, brand, isLoading: isProfileLoading } = useUserProfile();
  const {
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
  } = useProductState(userRole, brand);

  console.log("[Products] Rendering with:", {
    totalFilteredProducts: filteredProducts.length,
    searchQuery,
    userRole,
    brand
  });

  if (isProfileLoading || isProductsLoading) {
    return <ProductsSkeleton />;
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader title="Réservation des produits" />
        <ProductsHeaderContent />

        <ProductsHeader
          onOpenDialog={() => setOpen(true)}
          onProductsImported={(products) => {
            console.log('[Products] Importing products:', products.length);
            const productsWithBrand = products.map(product => ({
              ...product,
              brand: userRole === 'superadmin' ? (product.brand || 'schmidt') : brand
            }));
            productsWithBrand.forEach(product => {
              handleAddProduct(product);
            });
          }}
          onSearch={(query) => {
            console.log('[Products] Search triggered with:', query);
            setSearchQuery(query);
          }}
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