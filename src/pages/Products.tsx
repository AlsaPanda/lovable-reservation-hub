import NavBar from "@/components/NavBar";
import ProductForm from "@/components/products/ProductForm";
import ProductGrid from "@/components/products/ProductGrid";
import ProductsHeader from "@/components/products/ProductsHeader";
import PageHeader from "@/components/products/PageHeader";
import ProductsHeaderContent from "@/components/products/ProductsHeaderContent";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProductState } from "@/hooks/useProductState";
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
    deleteProductMutation,
    isReservationLoading
  } = useProductState(userRole, brand);

  if (isProfileLoading || isProductsLoading) {
    return <ProductsSkeleton />;
  }

  // Get products that have quantities set for reservation
  const productsToReserve = filteredProducts
    .filter(product => quantities[product.reference] > 0)
    .map(product => ({
      ...product,
      initial_quantity: quantities[product.reference]
    }));

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader title="Réservation des produits" />
        <ProductsHeaderContent />

        <ProductsHeader
          onOpenDialog={() => setOpen(true)}
          onProductsImported={(products) => {
            const productsWithBrand = products.map(product => ({
              ...product,
              brand: userRole === 'superadmin' ? (product.brand || 'schmidt') : brand
            }));
            productsWithBrand.forEach(product => {
              handleAddProduct(product);
            });
          }}
          onSearch={setSearchQuery}
          onReserve={handleReserveAll}
          totalQuantity={totalQuantity}
          isLoading={isReservationLoading}
          productsToReserve={productsToReserve}
          onQuantityChange={handleQuantityChange}
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