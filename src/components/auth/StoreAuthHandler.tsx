import { useEffect } from 'react';
import { useStoreAuth } from "@/hooks/useStoreAuth";

interface StoreAuthHandlerProps {
  storeId: string;
  token: string;
  brand?: string;
  countryCode?: string;
  languageCode?: string;
  context?: string;
}

export const StoreAuthHandler = ({
  storeId,
  token,
  brand = 'cuisinella',
  countryCode = 'fr-FR',
  languageCode = 'fr',
  context = '0'
}: StoreAuthHandlerProps) => {
  const { handleStoreAuth } = useStoreAuth();

  useEffect(() => {
    if (storeId && token) {
      // Ensure storeId is properly formatted (remove leading zeros)
      const formattedStoreId = storeId.replace(/^0+/, '');
      console.log('Formatted store ID:', formattedStoreId);
      
      handleStoreAuth(formattedStoreId, token, brand, countryCode, languageCode, context);
    }
  }, [storeId, token, brand, countryCode, languageCode, context]);

  return null;
};