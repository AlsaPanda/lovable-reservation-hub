import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

const ProductActions = () => {
  const queryClient = useQueryClient();

  return (
    <div className="flex justify-end">
      <Button 
        onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })} 
        className="px-6"
      >
        Rafraîchir les données
      </Button>
    </div>
  );
};

export default ProductActions;