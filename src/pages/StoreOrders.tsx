import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import * as XLSX from 'xlsx';
import { StoreOrdersTable } from "@/components/store-orders/StoreOrdersTable";
import { StoreOrderDetails } from "@/components/store-orders/StoreOrderDetails";
import { useStoreOrders } from "@/hooks/useStoreOrders";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DetailedReservation {
  id: string;
  product_name: string;
  quantity: number;
  reservation_date: string;
}

const StoreOrders = () => {
  const { storeOrders } = useStoreOrders();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [storeDetails, setStoreDetails] = useState<DetailedReservation[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  const fetchStoreDetails = async (storeName: string) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          id,
          product_name,
          quantity,
          reservation_date
        `)
        .eq('store_name', storeName)
        .order('reservation_date', { ascending: false });

      if (error) throw error;

      setStoreDetails(data || []);
      setSelectedStore(storeName);
      setIsDetailOpen(true);
    } catch (error) {
      console.error('Error fetching store details:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les détails du magasin"
      });
    }
  };

  const exportToExcel = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          store_name,
          product_name,
          quantity,
          reservation_date
        `)
        .order('reservation_date', { ascending: false });

      if (error) throw error;

      const exportData = data?.map(item => ({
        'Magasin': item.store_name,
        'Produit': item.product_name || 'Produit supprimé',
        'Quantité': item.quantity,
        'Date de réservation': new Date(item.reservation_date).toLocaleDateString('fr-FR'),
      })) || [];

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Commandes");
      XLSX.writeFile(wb, "commandes_magasins.xlsx");

      toast({
        title: "Export réussi",
        description: "Le fichier a été téléchargé avec succès",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'exporter les données"
      });
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8">
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Récapitulatif des commandes par magasin</CardTitle>
            <Button onClick={exportToExcel} variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </CardHeader>
          <CardContent>
            <StoreOrdersTable 
              storeOrders={storeOrders} 
              onViewDetails={fetchStoreDetails} 
            />
          </CardContent>
        </Card>

        <StoreOrderDetails 
          isOpen={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          selectedStore={selectedStore}
          storeDetails={storeDetails}
        />
      </div>
    </>
  );
};

export default StoreOrders;