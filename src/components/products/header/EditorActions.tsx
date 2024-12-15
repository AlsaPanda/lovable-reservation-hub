import { Button } from "@/components/ui/button";

interface EditorActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const EditorActions = ({ isEditing, isSaving, onSave, onCancel }: EditorActionsProps) => {
  if (!isEditing) return null;

  return (
    <div className="mt-4 flex gap-2">
      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
      </Button>
      <Button variant="outline" onClick={onCancel}>
        Annuler
      </Button>
    </div>
  );
};

export default EditorActions;