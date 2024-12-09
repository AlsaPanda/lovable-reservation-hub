import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/utils/types";
import { importProducts } from "@/utils/productUtils";
import { Calendar, RotateCcw, UploadCloud } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface ProductsHeaderProps {
  onOpenDialog: () => void;
  onProductsImported: (products: Product[]) => void;
  onSearch: (query: string) => void;
  products: Product[];
  onReserve: () => void;
  totalQuantity: number;
}

const ProductsHeader = ({ 
  onOpenDialog, 
  onProductsImported, 
  onSearch, 
  products,
  onReserve,
  totalQuantity 
}: ProductsHeaderProps) => {
  const session = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const handleResetQuantities = async () => {
    try {
      const { error } = await supabase.rpc('reset_all_quantities');

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast({
        title: "Quantités réinitialisées",
        description: "Toutes les quantités ont été remises à zéro.",
      });
    } catch (error) {
      console.error('Error resetting quantities:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de réinitialiser les quantités.",
      });
    }
  };

  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const canResetQuantities = !isAdmin && (userRole === 'magasin');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedProducts = await importProducts(file);
      onProductsImported(importedProducts);
    } catch (error) {
      console.error("Error importing products:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="sticky top-0 bg-background z-10 py-4 border-b">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4 items-center">
          <Input
            type="text"
            placeholder="Rechercher par titre ou référence..."
            onChange={handleSearch}
            className="w-full md:w-96"
          />
          {!isAdmin && (
            <div className="flex gap-2">
              <Button
                size="default"
                onClick={onReserve}
                disabled={totalQuantity === 0}
                className="whitespace-nowrap"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Je réserve ({totalQuantity} produits)
              </Button>
              {canResetQuantities && (
                <Button
                  variant="outline"
                  onClick={handleResetQuantities}
                  className="whitespace-nowrap"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
              )}
            </div>
          )}
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button onClick={onOpenDialog}>Ajouter un produit</Button>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".json,.xlsx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="cursor-pointer">
                <UploadCloud className="mr-2 h-4 w-4" />
                Importer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsHeader;