import { Product } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuantityChange: (reference: string, quantity: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (reference: string) => void;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

const ProductCard = ({ product, onQuantityChange, onEdit, onDelete }: ProductCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            <span className="line-clamp-2">{product["name-fr_fr-cla"] || product.description}</span>
          </CardTitle>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(product)}
              className="hover:bg-secondary"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(product.reference)}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <img 
              src={product.imageUrl || DEFAULT_IMAGE}
              alt={product["name-fr_fr-cla"] || product.description}
              onError={handleImageError}
              className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Référence: {product.reference}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Quantité souhaitée:</p>
            <Input
              type="number"
              value={product.availableQuantity}
              onChange={(e) => onQuantityChange(product.reference, e.target.value)}
              min="0"
              className="w-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;