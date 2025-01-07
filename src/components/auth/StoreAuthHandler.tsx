import { useEffect } from 'react';
import { useStoreAuth } from "@/hooks/useStoreAuth";
import { generateStoreToken } from "@/utils/tokenUtils";

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
    const validateAndHandleAuth = async () => {
      if (storeId && token) {
        const { token: expectedToken } = await generateStoreToken(storeId);
        if (token === expectedToken) {
          handleStoreAuth(storeId, token, brand, countryCode, languageCode, context);
        } else {
          console.error('Invalid token for store:', storeId);
        }
      }
    };

    validateAndHandleAuth();
  }, [storeId, token, brand, countryCode, languageCode, context, handleStoreAuth]);

  return null;
};