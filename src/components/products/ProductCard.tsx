import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Product } from "@/utils/types";

interface ProductCardProps {
  product: Product;
  onQuantityChange: (reference: string, quantity: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (reference: string) => void;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

const ProductCard = ({ product, onQuantityChange, onEdit, onDelete }: ProductCardProps) => {
  console.log("Product data:", product);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  return (
    <Card className="group relative overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            <span className="line-clamp-2">{product.reference}</span>
          </CardTitle>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(product)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(product.reference)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <img 
              src={product.imageUrl || DEFAULT_IMAGE}
              alt={product.reference}
              onError={handleImageError}
              className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {product.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;