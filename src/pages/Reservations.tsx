import NavBar from "@/components/NavBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reservation, Product } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

const Reservations = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
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

  // Charger les réservations depuis le localStorage
  useEffect(() => {
    const savedReservations = localStorage.getItem('reservations');
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    }

    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Sauvegarder les réservations dans le localStorage
  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  const handleAddReservation = (data: Reservation) => {
    // Vérifier si le produit existe et a assez de stock
    const product = products.find(p => p.reference === data.reference);
    if (!product) {
      toast({
        title: "Erreur",
        description: "Produit non trouvé.",
        variant: "destructive"
      });
      return;
    }

    if (product.availableQuantity < data.quantity) {
      toast({
        title: "Erreur",
        description: "Quantité insuffisante en stock.",
        variant: "destructive"
      });
      return;
    }

    // Mettre à jour le stock du produit
    const updatedProducts = products.map(p => {
      if (p.reference === data.reference) {
        return {
          ...p,
          availableQuantity: p.availableQuantity - data.quantity
        };
      }
      return p;
    });

    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
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
    // Restaurer l'ancien stock
    const oldReservation = reservations.find(r => r.reference === editingReservation?.reference);
    if (oldReservation) {
      const updatedProducts = products.map(p => {
        if (p.reference === oldReservation.reference) {
          return {
            ...p,
            availableQuantity: p.availableQuantity + oldReservation.quantity
          };
        }
        return p;
      });
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }

    // Vérifier le nouveau stock
    const product = products.find(p => p.reference === data.reference);
    if (!product || product.availableQuantity < data.quantity) {
      toast({
        title: "Erreur",
        description: "Quantité insuffisante en stock.",
        variant: "destructive"
      });
      return;
    }

    // Mettre à jour le stock avec la nouvelle quantité
    const finalProducts = products.map(p => {
      if (p.reference === data.reference) {
        return {
          ...p,
          availableQuantity: p.availableQuantity - data.quantity
        };
      }
      return p;
    });

    setProducts(finalProducts);
    localStorage.setItem('products', JSON.stringify(finalProducts));
    
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
    // Restaurer le stock
    const reservation = reservations.find(r => r.reference === reference);
    if (reservation) {
      const updatedProducts = products.map(p => {
        if (p.reference === reservation.reference) {
          return {
            ...p,
            availableQuantity: p.availableQuantity + reservation.quantity
          };
        }
        return p;
      });
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }

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
                        <FormLabel>Produit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un produit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.reference} value={product.reference}>
                                {product.description} (Stock: {product.availableQuantity})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                {reservations.map((reservation) => {
                  const product = products.find(p => p.reference === reservation.reference);
                  return (
                    <TableRow key={reservation.reference}>
                      <TableCell>{reservation.reference}</TableCell>
                      <TableCell>{product?.description || "Produit inconnu"}</TableCell>
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
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Reservations;