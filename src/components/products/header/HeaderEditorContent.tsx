import { Editor, EditorContent } from '@tiptap/react';
import { Pencil } from "lucide-react";

interface HeaderEditorContentProps {
  editor: Editor | null;
  isEditing: boolean;
  isSuperAdmin: boolean;
  onStartEdit: () => void;
}

const HeaderEditorContent = ({ editor, isEditing, isSuperAdmin, onStartEdit }: HeaderEditorContentProps) => {
  if (!editor) return null;

  return (
    <div className="relative group">
      <div className={`${isEditing ? 'border rounded-lg p-4' : ''}`}>
        <EditorContent editor={editor} />
      </div>
      {isSuperAdmin && !isEditing && (
        <button
          onClick={onStartEdit}
          className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full shadow-sm hover:shadow-md"
        >
          <Pencil className="h-4 w-4 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default HeaderEditorContent;