import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ProductsHeaderContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userRole } = useUserRole();
  const isSuperAdmin = userRole === 'superadmin';

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
        return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
      }

      return data?.content;
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: isSuperAdmin,
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

  if (isLoading) {
    return <div className="h-4 w-full animate-pulse bg-gray-200 rounded"></div>;
  }

  const handleSave = () => {
    if (editor) {
      updateContentMutation.mutate(editor.getHTML());
    }
  };

  return (
    <div className="prose prose-gray max-w-none mb-6">
      <div className={`text-gray-600 ${isSuperAdmin ? 'border rounded-lg p-4' : ''}`}>
        <EditorContent editor={editor} />
      </div>
      {isSuperAdmin && (
        <div className="mt-4">
          <Button 
            onClick={handleSave}
            disabled={updateContentMutation.isPending}
          >
            {updateContentMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsHeaderContent;