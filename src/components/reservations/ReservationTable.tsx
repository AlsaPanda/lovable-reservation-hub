import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Reservation } from "@/utils/types";
import { useUserProfile } from "@/hooks/useUserProfile";

interface ReservationTableProps {
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

export function ReservationTable({ reservations, onEdit, onDelete }: ReservationTableProps) {
  const { userRole } = useUserProfile();
  const isSuperAdmin = userRole === 'superadmin';

  console.log('ReservationTable - Current reservations:', reservations);
  console.log('ReservationTable - User role:', userRole);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  if (!reservations || reservations.length === 0) {
    return (
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
          <TableRow>
            <TableCell colSpan={isSuperAdmin ? 4 : 3} className="text-center py-8 text-muted-foreground">
              Aucune réservation trouvée
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
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
        {reservations.map((reservation) => {
          console.log('Rendering reservation:', reservation);
          return (
            <TableRow key={reservation.id}>
              <TableCell>{new Date(reservation.reservation_date).toLocaleDateString()}</TableCell>
              {isSuperAdmin && (
                <TableCell>
                  {reservation.store?.store_name || 'N/A'}
                </TableCell>
              )}
              <TableCell>
                <div className="space-y-1">
                  {reservation.product && (
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md">
                        <img 
                          src={reservation.product.image_url || DEFAULT_IMAGE}
                          alt={reservation.product.name}
                          onError={handleImageError}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-medium">{reservation.product.name}</span>
                        <span className="text-muted-foreground"> - {reservation.quantity} unités</span>
                      </div>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(reservation)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(reservation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}