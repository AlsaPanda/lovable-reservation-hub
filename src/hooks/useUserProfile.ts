import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from '@/types';

export const useUserProfile = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string>("");
  const [brand, setBrand] = useState<'schmidt' | 'cuisinella'>('schmidt');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, store_name, brand')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          console.log("User profile data:", data);
          setUserRole(data.role);
          setStoreName(data.store_name);
          setBrand(data.brand as 'schmidt' | 'cuisinella');
        } else {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return { userRole, storeName, brand };
};