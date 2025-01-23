import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Reservation } from "@/utils/types";

interface ReservationTableRowProps {
  reservation: Reservation;
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
  showStoreName?: boolean;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

export function ReservationTableRow({ 
  reservation, 
  onEdit, 
  onDelete, 
  showStoreName = false 
}: ReservationTableRowProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  return (
    <TableRow>
      <TableCell>{new Date(reservation.reservation_date).toLocaleDateString()}</TableCell>
      {showStoreName && (
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
}