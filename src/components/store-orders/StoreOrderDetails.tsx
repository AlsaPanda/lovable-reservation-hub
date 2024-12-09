import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DetailedReservation {
  id: string;
  product_name: string;
  quantity: number;
  reservation_date: string;
}

interface StoreOrderDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStore: string | null;
  storeDetails: DetailedReservation[];
}

export function StoreOrderDetails({ 
  isOpen, 
  onOpenChange, 
  selectedStore, 
  storeDetails 
}: StoreOrderDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Détail des commandes - {selectedStore}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}