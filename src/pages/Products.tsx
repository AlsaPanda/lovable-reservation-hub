import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/utils/types";
import { useState } from "react";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des Produits</h1>
      
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
                <p>Quantité disponible: {product.availableQuantity}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;