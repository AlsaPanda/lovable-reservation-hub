import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

interface ImportExportActionsProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImportExportActions = ({ onFileChange }: ImportExportActionsProps) => {
  return (
    <div className="relative">
      <input
        type="file"
        onChange={onFileChange}
        accept=".json,.xlsx"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Button variant="outline" className="pointer-events-none">
        <UploadCloud className="mr-2 h-4 w-4" />
        Importer
      </Button>
    </div>
  );
};

export default ImportExportActions;