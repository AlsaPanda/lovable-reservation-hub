import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/utils/types";
import { importProducts } from "@/utils/productUtils";
import { UploadCloud } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface ProductsHeaderProps {
  onOpenDialog: () => void;
  onProductsImported: (products: Product[]) => void;
  onSearch: (query: string) => void;
  products: Product[];
}

const ProductsHeader = ({ onOpenDialog, onProductsImported, onSearch, products }: ProductsHeaderProps) => {
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

  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

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

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="w-full md:w-96">
        <Input
          type="text"
          placeholder="Rechercher par titre ou référence..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full"
        />
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
            <Button variant="outline">
              <UploadCloud className="mr-2 h-4 w-4" />
              Importer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsHeader;