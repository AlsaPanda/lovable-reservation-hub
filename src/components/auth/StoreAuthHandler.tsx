import { useEffect } from "react";
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
  brand,
  countryCode,
  languageCode,
  context,
}: StoreAuthHandlerProps) => {
  const { handleStoreAuth } = useStoreAuth();

  useEffect(() => {
    console.log('StoreAuthHandler: Attempting authentication with:', { 
      storeId, 
      tokenLength: token?.length,
      brand,
      countryCode,
      languageCode,
      context
    });
    
    handleStoreAuth(
      storeId,
      token,
      brand,
      countryCode,
      languageCode,
      context
    );
  }, [storeId, token, brand, countryCode, languageCode, context, handleStoreAuth]);

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground">Authentification en cours...</p>
    </div>
  );
};