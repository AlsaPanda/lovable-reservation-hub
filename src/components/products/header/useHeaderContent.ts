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
      console.log('[useHeaderContent] Fetching header content');
      const { data, error } = await supabase
        .from('content_blocks')
        .select('content')
        .eq('placement', 'products_header')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[useHeaderContent] Error fetching header content:', error);
        throw error;
      }

      console.log('[useHeaderContent] Content fetched:', data);
      return data?.content || '';
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: async (newContent: string) => {
      console.log('[useHeaderContent] Updating content:', newContent);
      
      // First try to update existing record
      const { error: updateError } = await supabase
        .from('content_blocks')
        .update({ content: newContent })
        .eq('placement', 'products_header');

      // If no rows were updated, insert a new record
      if (updateError) {
        console.log('[useHeaderContent] No existing record found, creating new one');
        const { error: insertError } = await supabase
          .from('content_blocks')
          .insert({
            placement: 'products_header',
            content: newContent,
          });

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-content'] });
      toast({
        title: "Contenu mis à jour",
        description: "Le contenu a été sauvegardé avec succès.",
      });
    },
    onError: (error) => {
      console.error('[useHeaderContent] Error updating content:', error);
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