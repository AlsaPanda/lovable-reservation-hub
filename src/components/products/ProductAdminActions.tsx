/**
 * ProductAdminActions Component
 * 
 * Provides administrative actions (edit/delete) for products.
 * Only visible to users with admin privileges.
 * Actions appear on hover over the product card.
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Product } from "@/utils/types";

interface ProductAdminActionsProps {
  onEdit: (product: Product) => void;
  onDelete: (reference: string) => void;
  product: Product;
}

const ProductAdminActions = ({ onEdit, onDelete, product }: ProductAdminActionsProps) => {
  return (
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
  );
};

export default ProductAdminActions;
