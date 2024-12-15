import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

const ProductsHeaderContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userRole } = useUserRole();
  const isSuperAdmin = userRole === 'superadmin';
  const [isEditing, setIsEditing] = useState(false);

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

  const editor = useEditor({
    extensions: [StarterKit],
    editable: isEditing,
    content: '',
  });

  // Mettre à jour le contenu de l'éditeur quand les données sont chargées
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

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
      setIsEditing(false);
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
      <div className="relative group">
        <div className={`text-gray-600 ${isEditing ? 'border rounded-lg p-4' : ''}`}>
          <EditorContent editor={editor} />
        </div>
        {isSuperAdmin && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full shadow-sm hover:shadow-md"
          >
            <Pencil className="h-4 w-4 text-gray-600" />
          </button>
        )}
      </div>
      {isSuperAdmin && isEditing && (
        <div className="mt-4 flex gap-2">
          <Button 
            onClick={handleSave}
            disabled={updateContentMutation.isPending}
          >
            {updateContentMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setIsEditing(false);
              if (editor && content) {
                editor.commands.setContent(content);
              }
            }}
          >
            Annuler
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsHeaderContent;