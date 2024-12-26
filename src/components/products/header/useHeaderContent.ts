import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useHeaderContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: content, isLoading } = useQuery({
    queryKey: ['header-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('content')
        .eq('placement', 'products_header')
        .single();

      if (error) {
        console.error('Error fetching header content:', error);
        throw error;
      }

      return data?.content || '';
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: async (newContent: string) => {
      const { error } = await supabase
        .from('content_blocks')
        .upsert({
          placement: 'products_header',
          content: newContent,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-content'] });
      toast({
        title: "Contenu mis à jour",
        description: "Le contenu a été sauvegardé avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error updating content:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le contenu.",
      });
    },
  });

  return {
    content,
    isLoading,
    updateContentMutation,
    isEditing,
    setIsEditing,
  };
};