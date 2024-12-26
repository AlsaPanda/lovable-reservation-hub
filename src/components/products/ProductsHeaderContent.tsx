import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useUserRole } from "@/hooks/useUserRole";
import { useHeaderContent } from './header/useHeaderContent';
import ProductsHeaderEditor from './header/EditorContent';
import EditorActions from './header/EditorActions';

const ProductsHeaderContent = () => {
  const { userRole } = useUserRole();
  const isSuperAdmin = userRole === 'superadmin';
  const { content, isLoading, updateContentMutation, isEditing, setIsEditing } = useHeaderContent();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-w-none',
      },
    },
  });

  // Update editor content and editable state when content or editing state changes
  React.useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
      editor.setEditable(isEditing);
    }
  }, [editor, content, isEditing]);

  const handleSave = () => {
    if (editor) {
      updateContentMutation.mutate(editor.getHTML());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (editor && content) {
      editor.commands.setContent(content);
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return <div className="h-4 w-full animate-pulse bg-gray-200 rounded"></div>;
  }

  return (
    <div className="prose prose-gray max-w-none mb-6">
      <ProductsHeaderEditor
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