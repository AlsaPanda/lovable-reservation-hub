import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Product } from "@/utils/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (reference: string, quantity: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (reference: string) => void;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

const ProductCard = ({ product, quantity = 0, onQuantityChange, onEdit, onDelete }: ProductCardProps) => {
  const session = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState(quantity.toString());

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user role:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer le rôle de l'utilisateur.",
          });
        } else if (data) {
          setUserRole(data.role);
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [session, toast]);

  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onQuantityChange(product.reference, newValue);
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return "N/A";
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

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
          )}
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
              <p className="text-sm font-medium">Référence: {product.reference}</p>
              {isAdmin && (
                <>
                  <p className="text-sm font-medium">Prix d'achat HT: {formatPrice(product.purchase_price_ht)}</p>
                  <p className="text-sm font-medium">Prix de vente TTC: {formatPrice(product.sale_price_ttc)}</p>
                </>
              )}
              {!isAdmin && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Quantité souhaitée:</span>
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={handleQuantityChange}
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
                  Voir la fiche produit
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(ProductCard);