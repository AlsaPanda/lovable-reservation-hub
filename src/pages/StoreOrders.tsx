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

interface StoreOrder {
  store_name: string;
  total_reservations: number;
  total_products: number;
  last_reservation: string;
}

const StoreOrders = () => {
  const [storeOrders, setStoreOrders] = useState<StoreOrder[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStoreOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select(`
            store_name,
            quantity
          `)
          .order('reservation_date', { ascending: false });

        if (error) throw error;

        // Process the data to get summary per store
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

    fetchStoreOrders();
  }, [toast]);

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Récapitulatif des commandes par magasin</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Magasin</TableHead>
                  <TableHead>Nombre de réservations</TableHead>
                  <TableHead>Total produits réservés</TableHead>
                  <TableHead>Dernière réservation</TableHead>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default StoreOrders;