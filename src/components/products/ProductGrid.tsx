import { Product } from "@/utils/types";
import ProductCard from "./ProductCard";

/**
 * ProductGrid Component
 * 
 * Displays a responsive grid of ProductCard components.
 * Handles the layout and spacing of product cards.
 * Passes necessary props for product management and interaction.
 */

interface ProductGridProps {
  products: Product[];
  quantities: Record<string, number>;
  onQuantityChange: (reference: string, quantity: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (reference: string) => void;
}

const ProductGrid = ({ products, quantities, onQuantityChange, onEdit, onDelete }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[600px]">
      {products.map((product) => (
        <ProductCard
          key={`${product.reference}-${product.id}`} // Using both reference and id to ensure uniqueness
          product={product}
          quantity={quantities[product.reference] || 0}
          onQuantityChange={onQuantityChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
