import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Eye } from "lucide-react";
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StoreOrder {
  store_name: string;
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
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          store_name,
          quantity,
          reservation_date
        `)
        .order('reservation_date', { ascending: false });

      if (error) throw error;

      const ordersByStore = data.reduce((acc: { [key: string]: StoreOrder }, curr) => {
        if (!acc[curr.store_name]) {
          acc[curr.store_name] = {
            store_name: curr.store_name,
            total_reservations: 0,
            total_products: 0,
            last_reservation: curr.reservation_date
          };
        }
        acc[curr.store_name].total_reservations += 1;
        acc[curr.store_name].total_products += curr.quantity;
        return acc;
      }, {});

      setStoreOrders(Object.values(ordersByStore));
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
        .select(`
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

      const formattedData = data.map(item => ({
        id: item.id,
        product_name: item.products.name,
        quantity: item.quantity,
        reservation_date: item.reservation_date,
      }));

      setStoreDetails(formattedData);
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
      // Fetch all reservations with product details
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

      // Format data for export
      const exportData = data.map(item => ({
        'Magasin': item.store_name,
        'Produit': item.products.name,
        'Référence': item.products.reference,
        'Quantité': item.quantity,
        'Date de réservation': new Date(item.reservation_date).toLocaleDateString('fr-FR'),
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Commandes");

      // Generate and download file
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Magasin</TableHead>
                  <TableHead>Nombre de réservations</TableHead>
                  <TableHead>Total produits réservés</TableHead>
                  <TableHead>Dernière réservation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeOrders.map((order) => (
                  <TableRow key={order.store_name}>
                    <TableCell>{order.store_name}</TableCell>
                    <TableCell>{order.total_reservations}</TableCell>
                    <TableCell>{order.total_products}</TableCell>
                    <TableCell>
                      {new Date(order.last_reservation).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fetchStoreDetails(order.store_name)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                Détail des commandes - {selectedStore}
              </DialogTitle>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Date de réservation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeDetails.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell>{detail.product_name}</TableCell>
                    <TableCell>{detail.quantity}</TableCell>
                    <TableCell>
                      {new Date(detail.reservation_date).toLocaleDateString('fr-FR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default StoreOrders;