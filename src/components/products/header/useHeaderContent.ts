import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useHeaderContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: headerTitle } = useQuery({
    queryKey: ['header-title'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('content')
        .eq('placement', 'products_header')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching header title:', error);
        return null;
      }

      return data?.content;
    },
  });

  const updateTitleMutation = useMutation({
    mutationFn: async (newTitle: string) => {
      const { data: existingContent } = await supabase
        .from('content_blocks')
        .select('id')
        .eq('placement', 'products_header')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { error } = await supabase
        .from('content_blocks')
        .upsert({
          id: existingContent?.id,
          placement: 'products_header',
          content: newTitle,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-title'] });
      toast({
        title: "Titre mis à jour",
        description: "Le titre de la page a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du titre.",
        variant: "destructive",
      });
      console.error('Error updating title:', error);
    },
  });

  return {
    headerTitle,
    updateTitleMutation,
  };
};