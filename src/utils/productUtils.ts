import { Product } from "./types";
import * as XLSX from 'xlsx';

export const exportProducts = (products: Product[]) => {
  const dataStr = JSON.stringify(products, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'products.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importProducts = (file: File): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const products = JSON.parse(event.target?.result as string);
          resolve(products);
        } catch (error) {
          reject(new Error("Format de fichier JSON invalide"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Erreur lors de la lecture du fichier"));
      };
      
      reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx')) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          const products: Product[] = jsonData.map((row: any) => ({
            id: '',
            reference: row['sku']?.toString() || '',
            name: row['name-fr_FR-cla']?.toString() || row['sku']?.toString() || '',
            description: row['description']?.toString() || '',
            initial_quantity: 0,
            image_url: row['image-file_path']?.toString() || 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            purchase_price_ht: parseFloat(row['purchase_price_ht']) || null,
            sale_price_ttc: parseFloat(row['sale_price_ttc']) || null,
            product_url: row['product_url']?.toString() || null
          }));
          
          resolve(products);
        } catch (error) {
          reject(new Error("Format de fichier Excel invalide"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Erreur lors de la lecture du fichier Excel"));
      };
      
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Format de fichier non supporté. Utilisez .json ou .xlsx"));
    }
  });
};