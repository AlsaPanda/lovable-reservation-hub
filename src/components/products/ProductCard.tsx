import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Product } from "@/utils/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
  onQuantityChange: (reference: string, quantity: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (reference: string) => void;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

const ProductCard = ({ product, onQuantityChange, onEdit, onDelete }: ProductCardProps) => {
  const session = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (!error && data) {
          setUserRole(data.role);
        }
      }
    };

    fetchUserRole();
  }, [session]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  return (
    <Card className="group relative overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            <span className="line-clamp-2 font-semibold text-gray-900">{product.name}</span>
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
              src={product.image_url || DEFAULT_IMAGE}
              alt={product.reference}
              onError={handleImageError}
              className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {product.description}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">SKU: {product.reference}</p>
              {!isAdmin && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Quantité souhaitée:</span>
                  <Input
                    type="number"
                    value={product.initial_quantity}
                    onChange={(e) => onQuantityChange(product.reference, e.target.value)}
                    className="w-24 h-8"
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;