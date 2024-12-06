import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import NavBar from "@/components/NavBar";
import { Product } from "@/utils/types";
import ProductForm from "@/components/products/ProductForm";
import ProductCard from "@/components/products/ProductCard";
import ProductsHeader from "@/components/products/ProductsHeader";
import { Button } from "@/components/ui/button";

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    {
      reference: "TBL-001",
      description: "Table à manger extensible en chêne",
      initialQuantity: 20,
      availableQuantity: 0,
      imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500"
    },
    {
      reference: "TBL-002",
      description: "Table basse design scandinave",
      initialQuantity: 15,
      availableQuantity: 0,
      imageUrl: "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=500"
    },
    {
      reference: "CHR-001",
      description: "Chaise en velours bleu",
      initialQuantity: 40,
      availableQuantity: 0,
      imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500"
    },
    {
      reference: "CHR-002",
      description: "Chaise de salle à manger moderne",
      initialQuantity: 30,
      availableQuantity: 0,
      imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500"
    },
    {
      reference: "TBL-003",
      description: "Table de cuisine en marbre",
      initialQuantity: 10,
      availableQuantity: 0,
      imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500"
    },
    {
      reference: "CHR-003",
      description: "Lot de 6 chaises en bois massif",
      initialQuantity: 25,
      availableQuantity: 0,
      imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500"
    }
  ]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    toast({
      title: "Quantités sauvegardées",
      description: "Les quantités ont été sauvegardées avec succès.",
    });
  };

  const handleAddProduct = (data: Product) => {
    setProducts([...products, data]);
    setIsDialogOpen(false);
    toast({
      title: "Produit ajouté",
      description: "Le produit a été ajouté avec succès.",
    });
  };

  const handleUpdateProduct = (data: Product) => {
    setProducts(products.map(p => 
      p.reference === editingProduct?.reference ? data : p
    ));
    setIsDialogOpen(false);
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

  const handleProductsImported = (importedProducts: Product[]) => {
    setProducts(prevProducts => [...prevProducts, ...importedProducts]);
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Produits</h1>
        </div>

        <ProductsHeader
          onOpenDialog={() => setIsDialogOpen(true)}
          onProductsImported={handleProductsImported}
          products={products}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.reference}
              product={product}
              onQuantityChange={handleQuantityChange}
              onEdit={(product) => {
                setEditingProduct(product);
                setIsDialogOpen(true);
              }}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="px-6">
            Sauvegarder les quantités
          </Button>
        </div>

        <ProductForm 
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          editingProduct={editingProduct}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </>
  );
};

export default Products;