import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export const useUserProfile = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string>("");
  const [brand, setBrand] = useState<'schmidt' | 'cuisinella'>('schmidt');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchUserProfile = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (mounted) {
            toast({
              variant: "destructive",
              title: "Erreur de session",
              description: "Veuillez vous reconnecter",
            });
            navigate('/login');
          }
          return;
        }

        if (!sessionData.session?.user?.id) {
          console.log("No active session found");
          if (mounted) {
            navigate('/login');
          }
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, store_name, brand')
          .eq('id', sessionData.session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          if (mounted) {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de récupérer votre profil",
            });
            if (profileError.code === 'PGRST301') {
              navigate('/login');
            }
          }
          return;
        }

        if (profileData && mounted) {
          console.log("User profile data:", profileData);
          setUserRole(profileData.role);
          setStoreName(profileData.store_name);
          if (profileData.brand === 'schmidt' || profileData.brand === 'cuisinella') {
            setBrand(profileData.brand);
          }
        }
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la récupération de votre profil",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      mounted = false;
    };
  }, [toast, navigate]);

  return { userRole, storeName, brand, isLoading };
};