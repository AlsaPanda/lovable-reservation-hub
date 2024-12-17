import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Product } from "@/types/products";

interface UrlProductFieldsProps {
  form: UseFormReturn<Product>;
}

const UrlProductFields = ({ form }: UrlProductFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL de l'image</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="product_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL du produit</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default UrlProductFields;