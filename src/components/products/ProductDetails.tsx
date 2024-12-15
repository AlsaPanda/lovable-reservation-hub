import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink } from "lucide-react";
import { Product } from "@/utils/types";

interface ProductDetailsProps {
  product: Product;
  isAdmin: boolean;
  quantity: number;
  onQuantityChange: (reference: string, quantity: string) => void;
}

const ProductDetails = ({ product, isAdmin, quantity, onQuantityChange }: ProductDetailsProps) => {
  const formatPrice = (price: number | null) => {
    if (price === null) return "N/A";
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground line-clamp-3">
        {product.description}
      </p>
      <div className="space-y-2">
        <p className="text-sm font-medium">Référence: {product.reference}</p>
        {isAdmin && (
          <>
            <p className="text-sm font-medium">PA HT: {formatPrice(product.purchase_price_ht)}</p>
            <p className="text-sm font-medium">PV TTC: {formatPrice(product.sale_price_ttc)}</p>
          </>
        )}
        {!isAdmin && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Quantité souhaitée:</span>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => onQuantityChange(product.reference, e.target.value)}
              className="w-24 h-8"
              min="0"
            />
          </div>
        )}
        {product.product_url && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => window.open(product.product_url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Plus d'infos
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;