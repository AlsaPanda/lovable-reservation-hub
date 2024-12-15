import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/utils/types";
import ProductImage from "./ProductImage";
import ProductAdminActions from "./ProductAdminActions";
import ProductDetails from "./ProductDetails";
import { useUserRole } from "@/hooks/useUserRole";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (reference: string, quantity: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (reference: string) => void;
}

const ProductCard = ({ product, quantity = 0, onQuantityChange, onEdit, onDelete }: ProductCardProps) => {
  const { userRole, isLoading } = useUserRole();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  return (
    <Card className="group relative overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            <span className="line-clamp-2 font-semibold text-gray-900">{product.name}</span>
          </CardTitle>
          {isAdmin && (
            <ProductAdminActions
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ProductImage
            imageUrl={product.image_url}
            altText={product.reference}
          />
          <ProductDetails
            product={product}
            isAdmin={isAdmin}
            quantity={quantity}
            onQuantityChange={onQuantityChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(ProductCard);