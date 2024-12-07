import { Product } from "@/utils/types";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle, Dialog } from "@/components/ui/dialog";

interface ProductFormProps {
  onSubmit: (data: Product) => void;
  editingProduct: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductForm = ({ onSubmit, editingProduct, open, onOpenChange }: ProductFormProps) => {
  const form = useForm<Product>({
    defaultValues: editingProduct || {
      id: '',
      reference: "",
      name: "",
      description: "",
      initial_quantity: 0,
      image_url: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      availableQuantity: 0
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
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
              name="initial_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantité initiale</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de l'image</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {editingProduct ? "Mettre à jour" : "Ajouter"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;