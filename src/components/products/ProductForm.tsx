import { Product } from "@/utils/types";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProductFormProps {
  onSubmit: (data: Product) => void;
  editingProduct: Product | null;
}

const ProductForm = ({ onSubmit, editingProduct }: ProductFormProps) => {
  const form = useForm<Product>({
    defaultValues: editingProduct || {
      reference: "",
      description: "",
      initialQuantity: 0,
      availableQuantity: 0,
      imageUrl: ""
    }
  });

  return (
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
            name="initialQuantity"
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
            name="imageUrl"
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
  );
};

export default ProductForm;