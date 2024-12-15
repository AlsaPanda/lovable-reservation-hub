import { Editor, EditorContent } from '@tiptap/react';
import { Pencil } from "lucide-react";

interface EditorContentProps {
  editor: Editor | null;
  isEditing: boolean;
  isSuperAdmin: boolean;
  onStartEdit: () => void;
}

const EditorContent = ({ editor, isEditing, isSuperAdmin, onStartEdit }: EditorContentProps) => {
  if (!editor) return null;

  return (
    <div className="relative group">
      <div className={`text-gray-600 ${isEditing ? 'border rounded-lg p-4' : ''}`}>
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

export default EditorContent;