import NavBar from "@/components/NavBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reservation } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

const Reservations = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      reference: "REF001",
      description: "Produit A",
      quantity: 5,
      storeName: "Magasin Paris",
      date: "2024-02-20"
    },
    {
      reference: "REF002",
      description: "Produit B",
      quantity: 3,
      storeName: "Magasin Lyon",
      date: "2024-02-21"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  const form = useForm<Reservation>({
    defaultValues: {
      reference: "",
      description: "",
      quantity: 0,
      storeName: "",
      date: new Date().toISOString().split('T')[0]
    }
  });

  const handleAddReservation = (data: Reservation) => {
    setReservations([...reservations, data]);
    setIsDialogOpen(false);
    form.reset();
    toast({
      title: "Réservation ajoutée",
      description: "La réservation a été ajoutée avec succès.",
    });
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    form.reset(reservation);
    setIsDialogOpen(true);
  };

  const handleUpdateReservation = (data: Reservation) => {
    setReservations(reservations.map(r => 
      r.reference === editingReservation?.reference ? data : r
    ));
    setIsDialogOpen(false);
    setEditingReservation(null);
    form.reset();
    toast({
      title: "Réservation mise à jour",
      description: "La réservation a été mise à jour avec succès.",
    });
  };

  const handleDeleteReservation = (reference: string) => {
    setReservations(reservations.filter(r => r.reference !== reference));
    toast({
      title: "Réservation supprimée",
      description: "La réservation a été supprimée avec succès.",
    });
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Réservations</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle réservation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingReservation ? "Modifier la réservation" : "Nouvelle réservation"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(editingReservation ? handleUpdateReservation : handleAddReservation)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Référence</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantité</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Magasin</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    {editingReservation ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Liste des réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Magasin</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.reference}>
                    <TableCell>{reservation.reference}</TableCell>
                    <TableCell>{reservation.description}</TableCell>
                    <TableCell>{reservation.quantity}</TableCell>
                    <TableCell>{reservation.storeName}</TableCell>
                    <TableCell>{reservation.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditReservation(reservation)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReservation(reservation.reference)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

export default Reservations;