import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Reservation } from "@/utils/types";
import { ReservationTableRow } from "./ReservationTableRow";
import { useUserProfile } from "@/hooks/useUserProfile";

interface ReservationStoreGroupProps {
  storeName: string;
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
}

export function ReservationStoreGroup({ 
  storeName, 
  reservations,
  onEdit, 
  onDelete 
}: ReservationStoreGroupProps) {
  const { userRole } = useUserProfile();
  const isSuperAdmin = userRole === 'superadmin';

  return (
    <div className="rounded-lg border">
      <div className="bg-muted px-4 py-2 rounded-t-lg">
        <h3 className="font-semibold">{storeName}</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            {isSuperAdmin && <TableHead>Magasin</TableHead>}
            <TableHead>Produits réservés</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <ReservationTableRow
              key={reservation.id}
              reservation={reservation}
              onEdit={onEdit}
              onDelete={onDelete}
              showStoreName={isSuperAdmin}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}