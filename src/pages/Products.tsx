import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import NavBar from "@/components/NavBar";
import { Product } from "@/utils/types";
import ProductForm from "@/components/products/ProductForm";
import ProductGrid from "@/components/products/ProductGrid";
import ProductsHeader from "@/components/products/ProductsHeader";
import ProductPagination from "@/components/products/ProductPagination";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 6;
const STORAGE_KEY = 'products_data';

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem(STORAGE_KEY);
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleQuantityChange = (reference: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 0) return;

    setProducts(products.map(product => {
      if (product.reference === reference) {
        return { ...product, availableQuantity: quantity };
      }
      return product;
    }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    toast({
      title: "Quantités sauvegardées",
      description: "Les quantités ont été sauvegardées avec succès.",
    });
  };

  const handleAddProduct = (data: Product) => {
    setProducts([...products, data]);
    setOpen(false);
    toast({
      title: "Produit ajouté",
      description: "Le produit a été ajouté avec succès.",
    });
  };

  const handleUpdateProduct = (data: Product) => {
    setProducts(products.map(p => 
      p.reference === editingProduct?.reference ? data : p
    ));
    setOpen(false);
    setEditingProduct(null);
    toast({
      title: "Produit mis à jour",
      description: "Le produit a été mis à jour avec succès.",
    });
  };

  const handleDeleteProduct = (reference: string) => {
    setProducts(products.filter(p => p.reference !== reference));
    toast({
      title: "Produit supprimé",
      description: "Le produit a été supprimé avec succès.",
    });
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Gestion des Produits</h1>

        <ProductsHeader
          onOpenDialog={() => setOpen(true)}
          onProductsImported={setProducts}
          products={products}
        />

        <ProductGrid
          products={currentProducts}
          onQuantityChange={handleQuantityChange}
          onEdit={(product) => {
            setEditingProduct(product);
            setOpen(true);
          }}
          onDelete={handleDeleteProduct}
        />

        <ProductPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-6">
            Sauvegarder les quantités
          </Button>
        </div>

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