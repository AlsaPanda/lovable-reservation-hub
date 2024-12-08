import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ReservationDialog } from "@/components/reservations/ReservationDialog";
import { ReservationTable } from "@/components/reservations/ReservationTable";
import { useReservations } from "@/hooks/useReservations";
import { useProducts } from "@/hooks/useProducts";
import { Reservation } from "@/utils/types";

const Reservations = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  
  const { reservations, updateReservation, deleteReservation } = useReservations();
  const { data: products = [] } = useProducts();

  const handleSubmit = (data: Partial<Reservation>) => {
    if (editingReservation) {
      updateReservation.mutate(data);
      setIsDialogOpen(false);
      setEditingReservation(null);
    }
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsDialogOpen(true);
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Réservations</h1>
          <Button 
            className="gap-2" 
            onClick={() => {
              setEditingReservation(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Nouvelle réservation
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Liste des réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <ReservationTable
              reservations={reservations}
              onEdit={handleEdit}
              onDelete={(id) => deleteReservation.mutate(id)}
            />
          </CardContent>
        </Card>

        <ReservationDialog
          products={products}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          editingReservation={editingReservation}
        />
      </div>
    </>
  );
};

export default Reservations;