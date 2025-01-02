import { useState } from "react";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import * as XLSX from 'xlsx';
import { StoreOrdersTable } from "@/components/store-orders/StoreOrdersTable";
import { StoreOrderDetails } from "@/components/store-orders/StoreOrderDetails";
import { useStoreOrders } from "@/hooks/useStoreOrders";
import { useStoreDetails } from "@/hooks/useStoreDetails";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const StoreOrders = () => {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: storeOrders = [] } = useStoreOrders();
  const { data: storeDetails = [] } = useStoreDetails(selectedStore);

  const exportToExcel = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          store_name,
          quantity,
          reservation_date,
          products (
            name,
            reference
          )
        `)
        .order('reservation_date', { ascending: false });

      if (error) throw error;

      const exportData = data.map(item => ({
        'Magasin': item.store_name,
        'Produit': item.products.name,
        'Référence': item.products.reference,
        'Quantité': item.quantity,
        'Date de réservation': new Date(item.reservation_date).toLocaleDateString('fr-FR'),
      }));

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

  const handleViewDetails = (storeName: string) => {
    setSelectedStore(storeName);
    setIsDetailOpen(true);
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
              onViewDetails={handleViewDetails} 
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