import { Editor, EditorContent as TipTapEditor } from '@tiptap/react';
import { Pencil } from "lucide-react";

interface ProductsHeaderEditorProps {
  editor: Editor | null;
  isEditing: boolean;
  isSuperAdmin: boolean;
  onStartEdit: () => void;
}

const ProductsHeaderEditor = ({ editor, isEditing, isSuperAdmin, onStartEdit }: ProductsHeaderEditorProps) => {
  if (!editor) return null;

  return (
    <div className="relative group">
      <div className={`text-gray-600 ${isEditing ? 'border rounded-lg p-4' : ''}`}>
        <TipTapEditor editor={editor} />
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

export default ProductsHeaderEditor;