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
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.description || "Aucune description disponible"}
        </p>
        
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Référence: {product.reference}</p>
          
          <div className="space-y-1">
            <p className="text-sm font-medium flex justify-between">
              <span>PA HT:</span>
              <span className="font-bold">{formatPrice(product.purchase_price_ht)}</span>
            </p>
            <p className="text-sm font-medium flex justify-between">
              <span>PV TTC:</span>
              <span className="font-bold">{formatPrice(product.sale_price_ttc)}</span>
            </p>
          </div>
          
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
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={() => window.open(product.product_url || `https://example.com/products/${product.reference}`, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Plus d'infos
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;