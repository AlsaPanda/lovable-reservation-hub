import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useUserRole = () => {
  const session = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchUserRole = async () => {
      try {
        // First verify we have a valid session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession?.user?.id) {
          console.log('[useUserRole] No active session');
          if (mounted) {
            setIsLoading(false);
            navigate('/login');
          }
          return;
        }

        console.log('[useUserRole] Fetching role for user:', currentSession.user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentSession.user.id)
          .single();

        if (profileError) {
          console.error('[useUserRole] Profile fetch error:', profileError);
          if (profileError.code === 'PGRST301' || profileError.message?.includes('JWT')) {
            if (mounted) {
              toast({
                variant: "destructive",
                title: "Session expirée",
                description: "Veuillez vous reconnecter",
              });
              await supabase.auth.signOut();
              navigate('/login');
            }
          } else {
            if (mounted) {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de récupérer votre rôle",
              });
            }
          }
          return;
        }

        if (profileData && mounted) {
          console.log('[useUserRole] Role fetched:', profileData.role);
          setUserRole(profileData.role);
        }
      } catch (error) {
        console.error('[useUserRole] Fetch error:', error);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la récupération de votre rôle",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[useUserRole] Auth state changed:', event);
      if (!session && mounted) {
        navigate('/login');
      } else if (session) {
        fetchUserRole();
      }
    });

    // Initial fetch
    fetchUserRole();

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { userRole, isLoading };
};