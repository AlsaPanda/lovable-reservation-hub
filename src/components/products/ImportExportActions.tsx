import { Button } from "@/components/ui/button";
import { UploadCloud, FileDown } from "lucide-react";
import * as XLSX from 'xlsx';

interface ImportExportActionsProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImportExportActions = ({ onFileChange }: ImportExportActionsProps) => {
  const downloadTemplate = () => {
    // Create sample data
    const data = [
      {
        reference: 'REF001',
        name: 'Produit 1',
        description: 'Description du produit 1',
        initial_quantity: 10,
        image_url: 'https://example.com/image1.jpg',
        purchase_price_ht: 15.50,
        sale_price_ttc: 20.00,
        product_url: 'https://example.com/produit1',
        brand: 'schmidt'
      },
      {
        reference: 'REF002',
        name: 'Produit 2',
        description: 'Description du produit 2',
        initial_quantity: 5,
        image_url: 'https://example.com/image2.jpg',
        purchase_price_ht: 25.00,
        sale_price_ttc: 30.00,
        product_url: 'https://example.com/produit2',
        brand: 'cuisinella'
      }
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Products");

    // Save file
    XLSX.writeFile(wb, "template_import_produits.xlsx");
  };

  return (
    <div className="flex gap-2">
      <div className="relative">
        <input
          type="file"
          onChange={onFileChange}
          accept=".json,.xlsx"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <Button variant="outline" className="pointer-events-none">
          <UploadCloud className="mr-2 h-4 w-4" />
          Importer
        </Button>
      </div>
      <Button variant="outline" onClick={downloadTemplate}>
        <FileDown className="mr-2 h-4 w-4" />
        Télécharger le modèle
      </Button>
    </div>
  );
};

export default ImportExportActions;