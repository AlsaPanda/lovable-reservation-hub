import { Product } from "@/utils/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onQuantityChange: (reference: string, quantity: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (reference: string) => void;
}

const ProductGrid = ({ products, onQuantityChange, onEdit, onDelete }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[600px]">
      {products.map((product) => (
        <ProductCard
          key={product.reference}
          product={product}
          onQuantityChange={onQuantityChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductGrid;