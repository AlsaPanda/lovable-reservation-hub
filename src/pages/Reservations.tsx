import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ReservationDialog } from "@/components/reservations/ReservationDialog";
import { ReservationTable } from "@/components/reservations/ReservationTable";
import { useReservations } from "@/hooks/useReservations";
import { useProducts } from "@/hooks/useProducts";
import { Reservation } from "@/utils/types";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Reservations = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  
  const { reservations, updateReservation, deleteReservation } = useReservations();
  const { data: products = [] } = useProducts();
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

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

  if (!session) return null;

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Mes Réservations</h1>
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