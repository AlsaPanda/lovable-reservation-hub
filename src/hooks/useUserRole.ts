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
    const fetchUserRole = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[useUserRole] Session error:", sessionError);
          toast({
            variant: "destructive",
            title: "Erreur de session",
            description: "Veuillez vous reconnecter",
          });
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        if (!currentSession?.user?.id) {
          console.log('[useUserRole] No user ID in session');
          setIsLoading(false);
          return;
        }

        console.log('[useUserRole] Fetching role for user:', currentSession.user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentSession.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error("[useUserRole] Error fetching user role:", profileError);
          if (profileError.code === 'PGRST301' || profileError.message?.includes('JWT')) {
            console.log('[useUserRole] Invalid JWT, signing out');
            await supabase.auth.signOut();
            navigate('/login');
            toast({
              variant: "destructive",
              title: "Session expirée",
              description: "Veuillez vous reconnecter",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de récupérer votre rôle",
            });
          }
          return;
        }
        
        if (profileData) {
          console.log('[useUserRole] Role fetched successfully:', profileData.role);
          setUserRole(profileData.role);
        } else {
          console.log('[useUserRole] No profile data found');
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Profil non trouvé",
          });
          await supabase.auth.signOut();
          navigate('/login');
        }
      } catch (error) {
        console.error("[useUserRole] Error in fetchUserRole:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      console.log('[useUserRole] Session exists, fetching role');
      fetchUserRole();
    } else {
      console.log('[useUserRole] No session, skipping role fetch');
      setIsLoading(false);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[useUserRole] Auth state changed:', event);
      if (event === 'SIGNED_OUT') {
        setUserRole(null);
        navigate('/login');
      } else if (event === 'SIGNED_IN' && session?.user?.id) {
        fetchUserRole();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [session, toast, navigate]);

  return { userRole, isLoading };
};