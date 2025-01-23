import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Reservation } from "@/utils/types";
import { groupReservationsByStore, sortReservationsByDate } from "@/utils/reservationUtils";
import { ReservationStoreGroup } from "./ReservationStoreGroup";

interface ReservationTableProps {
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
}

export function ReservationTable({ reservations, onEdit, onDelete }: ReservationTableProps) {
  if (!reservations || reservations.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Produits réservés</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
              Aucune réservation trouvée
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  const groupedReservations = groupReservationsByStore(reservations);
  const sortedStores = Object.keys(groupedReservations).sort((a, b) => {
    const aLatest = new Date(groupedReservations[a][0].reservation_date).getTime();
    const bLatest = new Date(groupedReservations[b][0].reservation_date).getTime();
    return bLatest - aLatest;
  });

  return (
    <div className="space-y-8">
      {sortedStores.map(storeName => (
        <ReservationStoreGroup
          key={storeName}
          storeName={storeName}
          reservations={sortReservationsByDate(groupedReservations[storeName])}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}