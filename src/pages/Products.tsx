import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/utils/types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";

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

  // Simulons un nom de magasin (à remplacer par la vraie donnée utilisateur)
  const storeName = "Mon Magasin"; 

  const handleQuantityChange = (reference: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 0) return;

    setProducts(products.map(product => {
      if (product.reference === reference) {
        return {
          ...product,
          availableQuantity: quantity
        };
      }
      return product;
    }));
  };

  const handleSave = () => {
    // Ici nous simulerons la sauvegarde
    toast({
      title: "Quantités sauvegardées",
      description: "Les quantités ont été sauvegardées avec succès.",
    });
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Produits</h1>
          <div className="text-lg font-medium text-muted-foreground">
            Magasin : {storeName}
          </div>
        </div>
        
        {products.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Aucun produit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Importez un fichier CSV pour commencer à gérer vos produits.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.reference}>
                  <CardHeader>
                    <CardTitle>{product.description}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src={product.imageUrl || "/placeholder.svg"} 
                      alt={product.description}
                      className="w-full h-48 object-cover mb-4 rounded-md"
                    />
                    <p>Référence: {product.reference}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <p>Quantité souhaitée:</p>
                      <Input
                        type="number"
                        value={product.availableQuantity}
                        onChange={(e) => handleQuantityChange(product.reference, e.target.value)}
                        min="0"
                        className="w-24"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} className="px-6">
                Sauvegarder les quantités
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Products;