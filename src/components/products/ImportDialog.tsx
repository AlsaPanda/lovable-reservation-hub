import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Product } from "@/utils/types";

interface ImportDialogProps {
  showDialog: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: () => void;
  onCancel: () => void;
  forceImport: boolean;
  setForceImport: (force: boolean) => void;
  isSuperAdmin: boolean;
}

const ImportDialog = ({
  showDialog,
  onOpenChange,
  onImport,
  onCancel,
  forceImport,
  setForceImport,
  isSuperAdmin,
}: ImportDialogProps) => {
  return (
    <AlertDialog open={showDialog} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer l'import</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Par défaut, seuls les nouveaux produits seront importés (import différentiel).
              Les produits existants ne seront pas modifiés.
            </p>
            {isSuperAdmin && (
              <div className="flex items-center space-x-2 border rounded p-2 bg-gray-50">
                <input
                  type="checkbox"
                  id="force-import"
                  checked={forceImport}
                  onChange={(e) => setForceImport(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="force-import" className="text-sm font-medium text-gray-700">
                  Forcer l'import (supprime le catalogue existant)
                </label>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onImport}>Continuer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImportDialog;