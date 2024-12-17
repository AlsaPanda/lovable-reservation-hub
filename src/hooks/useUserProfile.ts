import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export const useUserProfile = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string>("");
  const [brand, setBrand] = useState<'schmidt' | 'cuisinella'>('schmidt');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // First check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          toast({
            variant: "destructive",
            title: "Erreur de session",
            description: "Veuillez vous reconnecter",
          });
          navigate('/login');
          return;
        }

        if (!session) {
          console.log("No active session found");
          navigate('/login');
          return;
        }

        // Now fetch the user profile
        const { data, error } = await supabase
          .from('profiles')
          .select('role, store_name, brand')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer votre profil",
          });
          if (error.code === 'PGRST301') {
            navigate('/login');
          }
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
  }, [toast, navigate]);

  return { userRole, storeName, brand };
};