import * as XLSX from 'xlsx';
import { Product } from '@/types/products';
import { supabase } from '@/integrations/supabase/client';

export const importProducts = async (file: File, differential: boolean = true): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const products: Product[] = jsonData.map((row: any) => ({
          id: crypto.randomUUID(),
          reference: row.reference,
          name: row.name,
          description: row.description,
          initial_quantity: Number(row.initial_quantity) || 0,
          image_url: row.image_url,
          purchase_price_ht: Number(row.purchase_price_ht) || null,
          sale_price_ttc: Number(row.sale_price_ttc) || null,
          product_url: row.product_url,
          brand: row.brand === 'cuisinella' ? 'cuisinella' : 'schmidt',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        if (differential) {
          const productsToImport = [];
          for (const product of products) {
            const { data: exists } = await supabase.rpc('product_exists', {
              ref: product.reference
            });
            if (!exists) {
              productsToImport.push(product);
            }
          }
          resolve(productsToImport);
        } else {
          resolve(products);
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const exportProducts = (products: Product[]) => {
  const worksheet = XLSX.utils.json_to_sheet(products);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  XLSX.writeFile(workbook, "products.xlsx");
};