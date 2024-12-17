import { Product } from "@/utils/types";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogContent, DialogHeader, DialogTitle, Dialog } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import BasicProductFields from "./form-fields/BasicProductFields";
import NumericProductFields from "./form-fields/NumericProductFields";
import UrlProductFields from "./form-fields/UrlProductFields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

interface ProductFormProps {
  onSubmit: (data: Product) => void;
  editingProduct: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole: string | null;
  brand: 'schmidt' | 'cuisinella';
}

const ProductForm = ({ onSubmit, editingProduct, open, onOpenChange, userRole, brand }: ProductFormProps) => {
  const defaultValues = editingProduct || {
    id: '',
    reference: "",
    name: "",
    description: "",
    initial_quantity: 0,
    image_url: "",
    purchase_price_ht: null,
    sale_price_ttc: null,
    product_url: "",
    brand: brand,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const form = useForm<Product>({
    defaultValues,
    values: editingProduct || undefined
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <BasicProductFields form={form} />
              <NumericProductFields form={form} />
              <UrlProductFields form={form} />
              
              {userRole === 'superadmin' && (
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marque</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une marque" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="schmidt">Schmidt</SelectItem>
                            <SelectItem value="cuisinella">Cuisinella</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full">
                {editingProduct ? "Mettre à jour" : "Ajouter"}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;