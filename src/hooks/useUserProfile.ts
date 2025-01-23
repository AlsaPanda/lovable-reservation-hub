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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (mounted) {
            setIsLoading(false);
            navigate('/login');
          }
          return;
        }

        if (!session?.user?.id) {
          console.log("No active session found");
          if (mounted) {
            setIsLoading(false);
            navigate('/login');
          }
          return;
        }

        if (mounted) {
          setEmail(session.user.email);
        }

        // Add retry logic for profile fetch
        let retryCount = 0;
        const maxRetries = 3;
        let profileData;
        let profileError;

        while (retryCount < maxRetries) {
          const response = await supabase
            .from('profiles')
            .select('role, store_name, brand, store_id')
            .eq('id', session.user.id)
            .maybeSingle();

          profileData = response.data;
          profileError = response.error;

          if (!profileError) break;

          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          if (mounted) {
            toast({
              title: "Error",
              description: "Failed to load user profile. Please try refreshing the page.",
              variant: "destructive"
            });
            if (profileError.code === 'PGRST301') {
              navigate('/login');
            }
            setIsLoading(false);
          }
          return;
        }

        if (profileData && mounted) {
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
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive"
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && mounted) {
        setUserRole(null);
        setStoreName("");
        setStoreId(null);
        setEmail(null);
        setBrand('schmidt');
        navigate('/login');
      } else if (session && mounted) {
        fetchUserProfile();
      }
    });

    fetchUserProfile();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { userRole, storeName, storeId, email, brand, isLoading };
};