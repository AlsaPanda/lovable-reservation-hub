import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/utils/types";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ProductImage from "./ProductImage";
import ProductAdminActions from "./ProductAdminActions";
import ProductDetails from "./ProductDetails";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (reference: string, quantity: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (reference: string) => void;
}

const ProductCard = ({ product, quantity = 0, onQuantityChange, onEdit, onDelete }: ProductCardProps) => {
  const session = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !currentSession) {
          console.error("Session error:", sessionError);
          toast({
            variant: "destructive",
            title: "Erreur de session",
            description: "Veuillez vous reconnecter",
          });
          await supabase.auth.signOut();
          return;
        }

        if (!currentSession.user?.id) {
          console.log('No user ID in session');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentSession.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching user role:", profileError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer votre rôle",
          });
          return;
        }
        
        if (profileData) {
          console.log('User role fetched successfully:', profileData.role);
          setUserRole(profileData.role);
        }
      } catch (error) {
        console.error("Error in fetchUserRole:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchUserRole();
    } else {
      setIsLoading(false);
    }
  }, [session, toast]);

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