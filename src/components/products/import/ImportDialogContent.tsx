import { AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

interface ImportDialogContentProps {
  isSuperAdmin: boolean;
  forceImport: boolean;
  setForceImport: (force: boolean) => void;
  isLoading: boolean;
  importCount: number | null;
  onFileSelect: () => void;
}

const ImportDialogContent = ({
  isSuperAdmin,
  forceImport,
  setForceImport,
  isLoading,
  importCount,
  onFileSelect,
}: ImportDialogContentProps) => {
  return (
    <AlertDialogDescription className="space-y-4">
      <p>
        Par défaut, seuls les nouveaux produits seront importés (import différentiel).
        {isSuperAdmin && " En tant que superadmin, vous pouvez forcer l'import de tous les produits."}
      </p>

      {isSuperAdmin && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="force-import"
            checked={forceImport}
            onChange={(e) => setForceImport(e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label 
            htmlFor="force-import" 
            className={`text-sm font-medium ${isLoading ? 'text-gray-400' : 'text-gray-700'}`}
          >
            Forcer l'import (remplacer tous les produits)
          </label>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Button 
          variant="outline" 
          onClick={onFileSelect}
          disabled={isLoading}
          className="w-full"
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          {isLoading ? "Importation en cours..." : "Sélectionner un fichier Excel"}
        </Button>
        
        {isLoading && (
          <p className="text-sm text-center text-muted-foreground animate-pulse">
            Import en cours, veuillez patienter...
          </p>
        )}
        
        {importCount !== null && !isLoading && (
          <p className="text-sm text-center text-green-600 font-medium">
            {importCount === 0 
              ? "Aucun nouveau produit n'a été trouvé dans le fichier."
              : importCount === 1 
                ? "1 produit a été importé avec succès."
                : `${importCount} produits ont été importés avec succès.`}
          </p>
        )}
      </div>
    </AlertDialogDescription>
  );
};

export default ImportDialogContent;