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
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="force-import"
                  checked={forceImport}
                  onChange={(e) => setForceImport(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="force-import" className="text-sm font-medium">
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