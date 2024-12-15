import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Product } from "@/utils/types";

interface NumericProductFieldsProps {
  form: UseFormReturn<Product>;
}

const NumericProductFields = ({ form }: NumericProductFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="initial_quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantité initiale</FormLabel>
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
        name="purchase_price_ht"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prix d'achat HT</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                {...field} 
                onChange={e => field.onChange(parseFloat(e.target.value))}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sale_price_ttc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prix de vente TTC</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                {...field}
                onChange={e => field.onChange(parseFloat(e.target.value))}
                value={field.value || ''}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default NumericProductFields;