import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user);
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, store_name')
          .eq('id', user.id)
          .single();
        
        console.log("User profile data:", data);
        console.log("User role:", data?.role);
        
        if (!error && data) {
          setUserRole(data.role);
          setStoreName(data.store_name);
        } else {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return { userRole, storeName };
};