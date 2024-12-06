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

const ProductCard = ({ product, onQuantityChange, onEdit, onDelete }: ProductCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{product.description}</span>
          <div className="flex gap-2">
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
        </CardTitle>
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
            onChange={(e) => onQuantityChange(product.reference, e.target.value)}
            min="0"
            className="w-24"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;