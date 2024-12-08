import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product, Reservation } from "@/utils/types";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface ReservationDialogProps {
  products: Product[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Reservation>) => void;
  editingReservation: Reservation | null;
}

export function ReservationDialog({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  editingReservation 
}: ReservationDialogProps) {
  const form = useForm<Partial<Reservation>>();

  // Reset form when editingReservation changes
  useEffect(() => {
    if (editingReservation) {
      form.reset({
        product_id: editingReservation.product_id,
        quantity: editingReservation.quantity,
        reservation_date: editingReservation.reservation_date ? 
          new Date(editingReservation.reservation_date).toISOString().split('T')[0] : 
          new Date().toISOString().split('T')[0]
      });
    }
  }, [editingReservation, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Modifier la réservation
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="product_id"
              render={() => (
                <FormItem>
                  <FormLabel>Produit</FormLabel>
                  <FormControl>
                    <Input 
                      value={editingReservation?.product?.name || ''} 
                      disabled 
                    />
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
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reservation_date"
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
              Mettre à jour
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}