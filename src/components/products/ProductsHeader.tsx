import { Button } from "@/components/ui/button";
import { Product } from "@/utils/types";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import SearchBar from "./SearchBar";
import ReservationActions from "./ReservationActions";
import ImportExportActions from "./ImportExportActions";
import { importProducts } from "@/utils/productUtils";

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

  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const canResetQuantities = !isAdmin && (userRole === 'magasin');

  return (
    <div className="sticky top-0 bg-background z-10 py-4 border-b">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4 items-center">
          <SearchBar onSearch={onSearch} />
          {!isAdmin && (
            <ReservationActions
              onReserve={onReserve}
              onReset={handleResetQuantities}
              totalQuantity={totalQuantity}
              canResetQuantities={canResetQuantities}
            />
          )}
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button onClick={onOpenDialog}>Ajouter un produit</Button>
            <ImportExportActions onFileChange={handleFileChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsHeader;