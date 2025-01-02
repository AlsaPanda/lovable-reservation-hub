import { supabase } from "@/integrations/supabase/client";

export const generateStoreEmail = (storeId: string) => {
  // Preserve the original storeId format, including leading zeros
  return `${storeId}@store.cuisinella.fr`;
};

export const normalizeBrand = (brand: string) => {
  return brand === 'sch' ? 'schmidt' : brand;
};

export const signInStore = async (email: string, password: string) => {
  console.log('Attempting to sign in store:', email);
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
  console.log('Creating new store account:', { email, metadata });
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        ...metadata,
        role: 'magasin',
        store_name: `Store ${metadata.store_id}`
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
  console.log('Updating store profile:', { userId, data });
  return await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);
};