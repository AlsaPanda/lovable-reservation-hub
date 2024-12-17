import { supabase } from "@/integrations/supabase/client";

export const generateStoreEmail = (storeId: string) => {
  return `${storeId}@store.cuisinella.fr`;
};

export const normalizeBrand = (brand: string) => {
  return brand === 'sch' ? 'schmidt' : brand;
};

export const signInStore = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signUpStore = async (
  email: string, 
  password: string, 
  metadata: {
    store_id: string;
    brand: string;
    country_code: string;
    language_code: string;
    context: string;
  }
) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        ...metadata,
        role: 'magasin'
      }
    }
  });
};

export const updateStoreProfile = async (
  userId: string,
  data: {
    brand: string;
    country_code: string;
    language_code: string;
    context: string;
  }
) => {
  return await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);
};