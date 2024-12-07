import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reservation, Product } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReservationDialog } from "@/components/reservations/ReservationDialog";
import { ReservationTable } from "@/components/reservations/ReservationTable";

const Reservations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      return data as Product[];
    }
  });

  // Fetch reservations with products
  const { data: reservations = [] } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          product:products(*)
        `);
      
      if (error) throw error;
      return data as Reservation[];
    }
  });

  // Add reservation mutation
  const addReservation = useMutation({
    mutationFn: async (newReservation: Partial<Reservation>) => {
      const { data, error } = await supabase
        .from('reservations')
        .insert([newReservation])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      setIsDialogOpen(false);
      toast({
        title: "Réservation ajoutée",
        description: "La réservation a été ajoutée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Update reservation mutation
  const updateReservation = useMutation({
    mutationFn: async (updatedReservation: Partial<Reservation>) => {
      const { data, error } = await supabase
        .from('reservations')
        .update(updatedReservation)
        .eq('id', editingReservation?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      setIsDialogOpen(false);
      setEditingReservation(null);
      toast({
        title: "Réservation mise à jour",
        description: "La réservation a été mise à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete reservation mutation
  const deleteReservation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Réservation supprimée",
        description: "La réservation a été supprimée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: Partial<Reservation>) => {
    if (editingReservation) {
      updateReservation.mutate(data);
    } else {
      addReservation.mutate(data);
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