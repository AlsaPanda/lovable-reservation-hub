import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ProductActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleResetQuantities = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ initial_quantity: 0 });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast({
        title: "Quantités réinitialisées",
        description: "Toutes les quantités ont été remises à zéro.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de réinitialiser les quantités.",
      });
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        variant="outline"
        size="lg"
        onClick={handleResetQuantities}
        className="shadow-lg"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Réinitialiser les quantités
      </Button>
    </div>
  );
};

export default ProductActions;