import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface StoreOrder {
  store_name: string;
  store_id: string;
  total_reservations: number;
  total_products: number;
  last_reservation: string;
}

interface StoreOrdersTableProps {
  storeOrders: StoreOrder[];
  onViewDetails: (storeName: string) => void;
}

export function StoreOrdersTable({ storeOrders, onViewDetails }: StoreOrdersTableProps) {
  if (!storeOrders || storeOrders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune commande trouvée
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Magasin</TableHead>
          <TableHead>ID Magasin</TableHead>
          <TableHead>Nombre de réservations</TableHead>
          <TableHead>Total produits réservés</TableHead>
          <TableHead>Dernière réservation</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {storeOrders.map((order) => (
          <TableRow key={order.store_id}>
            <TableCell>{order.store_name}</TableCell>
            <TableCell>{order.store_id}</TableCell>
            <TableCell>{order.total_reservations}</TableCell>
            <TableCell>{order.total_products}</TableCell>
            <TableCell>
              {new Date(order.last_reservation).toLocaleDateString('fr-FR')}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(order.store_name)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}