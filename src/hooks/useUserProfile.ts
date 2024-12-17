import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export const useUserProfile = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string>("");
  const [storeId, setStoreId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [brand, setBrand] = useState<'schmidt' | 'cuisinella'>('schmidt');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchUserProfile = async () => {
      try {
        // First check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
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

        if (!session) {
          console.log("No active session found");
          if (mounted) {
            navigate('/login');
          }
          return;
        }

        // Set email from session
        setEmail(session.user.email);

        // Then fetch the profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, store_name, brand, store_id')
          .eq('id', session.user.id)
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
          setStoreId(profileData.store_id);
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && mounted) {
        navigate('/login');
      }
    });

    fetchUserProfile();

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  return { userRole, storeName, storeId, email, brand, isLoading };
};