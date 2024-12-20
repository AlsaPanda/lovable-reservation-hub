import { FC, useState } from "react";
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import HeaderEditorContent from "./header/HeaderEditorContent";
import HeaderEditorActions from "./header/HeaderEditorActions";
import { useHeaderContent } from "./header/useHeaderContent";

interface PageHeaderProps {
  title: string;
  userRole?: string | null;
}

const PageHeader: FC<PageHeaderProps> = ({ title, userRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const isSuperAdmin = userRole === 'superadmin';
  const { headerTitle, updateTitleMutation } = useHeaderContent();

  const editor = useEditor({
    extensions: [StarterKit],
    content: headerTitle || title,
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-w-none text-3xl font-bold',
      },
    },
  });

  const handleSave = () => {
    if (editor) {
      updateTitleMutation.mutate(editor.getHTML());
      setIsEditing(false);
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
      <HeaderEditorContent
        editor={editor}
        isEditing={isEditing}
        isSuperAdmin={isSuperAdmin}
        onStartEdit={() => {
          setIsEditing(true);
          editor.setEditable(true);
        }}
      />
      <HeaderEditorActions
        isEditing={isEditing}
        isSaving={updateTitleMutation.isPending}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default PageHeader;