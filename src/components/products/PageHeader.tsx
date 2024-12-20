import { FC, useState } from "react";
import { Editor, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PageHeaderProps {
  title: string;
  userRole?: string | null;
}

const PageHeader: FC<PageHeaderProps> = ({ title, userRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isSuperAdmin = userRole === 'superadmin';

  const { data: headerTitle } = useQuery({
    queryKey: ['header-title'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('content')
        .eq('placement', 'page_header')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching header title:', error);
        return title;
      }

      return data?.content || title;
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: headerTitle,
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-w-none text-3xl font-bold',
      },
    },
  });

  const updateTitleMutation = useMutation({
    mutationFn: async (newTitle: string) => {
      const { data: existingContent } = await supabase
        .from('content_blocks')
        .select('id')
        .eq('placement', 'page_header')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { error } = await supabase
        .from('content_blocks')
        .upsert({
          id: existingContent?.id,
          placement: 'page_header',
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
      setIsEditing(false);
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

  const handleSave = () => {
    if (editor) {
      updateTitleMutation.mutate(editor.getHTML());
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (editor && headerTitle) {
      editor.commands.setContent(headerTitle);
    }
  };

  if (!editor) return <h1 className="text-3xl font-bold">{headerTitle || title}</h1>;

  return (
    <div className="space-y-4">
      <div className="relative group">
        <div className={`${isEditing ? 'border rounded-lg p-4' : ''}`}>
          <EditorContent editor={editor} />
        </div>
        {isSuperAdmin && !isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              editor.setEditable(true);
            }}
            className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full shadow-sm hover:shadow-md"
          >
            <Pencil className="h-4 w-4 text-gray-600" />
          </button>
        )}
      </div>
      {isEditing && (
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={updateTitleMutation.isPending}>
            {updateTitleMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
        </div>
      )}
    </div>
  );
};

export default PageHeader;