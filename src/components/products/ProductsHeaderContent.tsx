import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useUserRole } from "@/hooks/useUserRole";
import { useState, useEffect } from "react";
import { useHeaderContent } from './header/useHeaderContent';
import EditorContent from './header/EditorContent';
import EditorActions from './header/EditorActions';

const ProductsHeaderContent = () => {
  const { userRole } = useUserRole();
  const isSuperAdmin = userRole === 'superadmin';
  const [isEditing, setIsEditing] = useState(false);
  const { content, isLoading, updateContentMutation } = useHeaderContent();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-w-none',
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
      if (content) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content, isEditing]);

  const handleSave = () => {
    if (editor) {
      updateContentMutation.mutate(editor.getHTML());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (editor && content) {
      editor.commands.setContent(content);
    }
  };

  if (isLoading) {
    return <div className="h-4 w-full animate-pulse bg-gray-200 rounded"></div>;
  }

  return (
    <div className="prose prose-gray max-w-none mb-6">
      <EditorContent
        editor={editor}
        isEditing={isEditing}
        isSuperAdmin={isSuperAdmin}
        onStartEdit={() => setIsEditing(true)}
      />
      <EditorActions
        isEditing={isEditing}
        isSaving={updateContentMutation.isPending}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ProductsHeaderContent;