import { Button } from "@/components/ui/button";

interface HeaderEditorActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const HeaderEditorActions = ({ isEditing, isSaving, onSave, onCancel }: HeaderEditorActionsProps) => {
  if (!isEditing) return null;

  return (
    <div className="flex gap-2">
      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
      </Button>
      <Button variant="outline" onClick={onCancel}>
        Annuler
      </Button>
    </div>
  );
};

export default HeaderEditorActions;