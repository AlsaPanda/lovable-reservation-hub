import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import NavBar from "@/components/NavBar";
import { Product } from "@/utils/types";
import ProductForm from "@/components/products/ProductForm";
import ProductGrid from "@/components/products/ProductGrid";
import ProductsHeader from "@/components/products/ProductsHeader";
import ProductPagination from "@/components/products/ProductPagination";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 6;

const Products = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(product => ({
        ...product,
        availableQuantity: product.initial_quantity
      }));
    }
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      const { error } = await supabase
        .from('products')
        .insert({
          reference: product.reference,
          name: product.name,
          description: product.description,
          initial_quantity: product.initialQuantity,
          image_url: product.imageUrl
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté avec succès.",
      });
      setOpen(false);
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      const { error } = await supabase
        .from('products')
        .update({
          reference: product.reference,
          name: product.name,
          description: product.description,
          initial_quantity: product.initialQuantity,
          image_url: product.imageUrl
        })
        .eq('reference', product.reference);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès.",
      });
      setOpen(false);
      setEditingProduct(null);
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (reference: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('reference', reference);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
    }
  });

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleQuantityChange = (reference: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 0) return;

    const product = products.find(p => p.reference === reference);
    if (!product) return;

    updateProductMutation.mutate({
      ...product,
      initialQuantity: quantity,
      availableQuantity: quantity
    });
  };

  const handleAddProduct = (data: Product) => {
    addProductMutation.mutate(data);
  };

  const handleUpdateProduct = (data: Product) => {
    updateProductMutation.mutate(data);
  };

  const handleDeleteProduct = (reference: string) => {
    deleteProductMutation.mutate(reference);
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Gestion des Produits</h1>

        <ProductsHeader
          onOpenDialog={() => setOpen(true)}
          onProductsImported={(products) => {
            // Handle bulk import through individual inserts
            products.forEach(product => {
              addProductMutation.mutate(product);
            });
          }}
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
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })} className="px-6">
            Rafraîchir les données
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