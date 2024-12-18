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
      // Use the original storeId format without removing leading zeros
      console.log('Using store ID:', storeId);
      
      handleStoreAuth(storeId, token, brand, countryCode, languageCode, context);
    }
  }, [storeId, token, brand, countryCode, languageCode, context]);

  return null;
};