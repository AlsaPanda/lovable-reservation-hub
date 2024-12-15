import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useHeaderContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: content, isLoading } = useQuery({
    queryKey: ['header-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('content')
        .eq('placement', 'products_header')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching header content:', error);
        return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
      }

      return data?.content;
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: async (newContent: string) => {
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
          content: newContent,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-content'] });
      toast({
        title: "Contenu mis à jour",
        description: "Le contenu de l'en-tête a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du contenu.",
        variant: "destructive",
      });
      console.error('Error updating content:', error);
    },
  });

  return {
    content,
    isLoading,
    updateContentMutation,
  };
};