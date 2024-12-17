import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserProfile = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string>("");
  const [brand, setBrand] = useState<'schmidt' | 'cuisinella'>('schmidt');
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('role, store_name, brand')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error("Error fetching profile:", error);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de récupérer votre profil",
            });
            return;
          }

          if (data) {
            console.log("User profile data:", data);
            setUserRole(data.role);
            setStoreName(data.store_name);
            if (data.brand === 'schmidt' || data.brand === 'cuisinella') {
              setBrand(data.brand);
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la récupération de votre profil",
        });
      }
    };

    fetchUserProfile();
  }, [toast]);

  return { userRole, storeName, brand };
};