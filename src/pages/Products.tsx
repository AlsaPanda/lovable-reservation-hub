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
import { ReservationDialog } from "@/components/reservations/ReservationDialog";
import { useSession } from "@supabase/auth-helpers-react";

const ITEMS_PER_PAGE = 12;

const Products = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  // Add reservation mutation
  const addReservationMutation = useMutation({
    mutationFn: async (data: { product_id: string, quantity: number, reservation_date: string }) => {
      const { error } = await supabase
        .from('reservations')
        .insert({
          product_id: data.product_id,
          quantity: data.quantity,
          reservation_date: data.reservation_date,
          store_name: session?.user?.id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Réservation ajoutée",
        description: "La réservation a été ajoutée avec succès.",
      });
      setIsReservationDialogOpen(false);
      setSelectedProduct(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
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
          initial_quantity: product.initial_quantity,
          image_url: product.image_url
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
          initial_quantity: product.initial_quantity,
          image_url: product.image_url
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

  const handleQuantityChange = (reference: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 0) return;

    const product = products.find(p => p.reference === reference);
    if (!product) return;

    updateProductMutation.mutate({
      ...product,
      initial_quantity: quantity,
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleReserve = (product: Product) => {
    setSelectedProduct(product);
    setIsReservationDialogOpen(true);
  };

  const handleReservationSubmit = (data: any) => {
    if (!selectedProduct) return;
    
    addReservationMutation.mutate({
      product_id: selectedProduct.id,
      quantity: data.quantity,
      reservation_date: data.reservation_date
    });
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Gestion des Produits</h1>

        <ProductsHeader
          onOpenDialog={() => setOpen(true)}
          onProductsImported={(products) => {
            products.forEach(product => {
              addProductMutation.mutate(product);
            });
          }}
          onSearch={handleSearch}
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
          onReserve={handleReserve}
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

        <ReservationDialog
          products={[selectedProduct].filter(Boolean) as Product[]}
          isOpen={isReservationDialogOpen}
          onOpenChange={setIsReservationDialogOpen}
          onSubmit={handleReservationSubmit}
          editingReservation={null}
        />
      </div>
    </>
  );
};

export default Products;
