import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import * as XLSX from 'xlsx';
import { StoreOrdersTable } from "@/components/store-orders/StoreOrdersTable";
import { StoreOrderDetails } from "@/components/store-orders/StoreOrderDetails";
import { Database } from "@/integrations/supabase/types";

interface StoreOrder {
  store_name: string;
  store_id: string;
  total_reservations: number;
  total_products: number;
  last_reservation: string;
}

interface DetailedReservation {
  id: string;
  product_name: string;
  quantity: number;
  reservation_date: string;
}

type ReservationWithProduct = Database['public']['Tables']['reservations']['Row'] & {
  products: Database['public']['Tables']['products']['Row'];
};

const StoreOrders = () => {
  const [storeOrders, setStoreOrders] = useState<StoreOrder[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [storeDetails, setStoreDetails] = useState<DetailedReservation[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStoreOrders();
  }, []);

  const fetchStoreOrders = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('store_name, store_id');

      if (profilesError) throw profilesError;

      const storeIdMap = profiles?.reduce((acc: { [key: string]: string }, profile) => {
        if (profile.store_name && profile.store_id) {
          acc[profile.store_name] = profile.store_id;
        }
        return acc;
      }, {});

      const { data, error } = await supabase
        .from('reservations')
        .select(`
          store_name,
          quantity,
          reservation_date
        `);

      if (error) throw error;

      const ordersByStore = data?.reduce((acc: { [key: string]: StoreOrder }, curr) => {
        if (!acc[curr.store_name]) {
          acc[curr.store_name] = {
            store_name: curr.store_name,
            store_id: storeIdMap?.[curr.store_name] || 'N/A',
            total_reservations: 0,
            total_products: 0,
            last_reservation: curr.reservation_date
          };
        }
        acc[curr.store_name].total_reservations += 1;
        acc[curr.store_name].total_products += curr.quantity;
        return acc;
      }, {});

      setStoreOrders(Object.values(ordersByStore || {}));
    } catch (error) {
      console.error('Error fetching store orders:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les commandes des magasins"
      });
    }
  };

  const fetchStoreDetails = async (storeName: string) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select<string, ReservationWithProduct>(`
          id,
          quantity,
          reservation_date,
          products (
            name
          )
        `)
        .eq('store_name', storeName)
        .order('reservation_date', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(item => ({
        id: item.id,
        product_name: item.products?.name || 'Unknown Product',
        quantity: item.quantity,
        reservation_date: item.reservation_date,
      }));

      setStoreDetails(formattedData || []);
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
        .select<string, ReservationWithProduct>(`
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

      const exportData = data?.map(item => ({
        'Magasin': item.store_name,
        'Produit': item.products?.name || 'Unknown Product',
        'Référence': item.products?.reference || 'N/A',
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