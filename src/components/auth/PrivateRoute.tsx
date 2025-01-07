import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  excludedRoles?: string[];
}

const PrivateRoute = ({ children, allowedRoles, excludedRoles }: PrivateRouteProps) => {
  const session = useSession();
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        if (!session?.user?.id) {
          console.log('No session or user ID available');
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        console.log('Fetching profile for user:', session.user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error("Error fetching user role:", profileError);
          if (mounted) {
            if (profileError.code === 'PGRST301' || profileError.message?.includes('JWT')) {
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
          }
          return;
        }
        
        if (!profileData && mounted) {
          console.log('No profile data found');
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer votre profil",
          });
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }
        
        if (profileData && mounted) {
          console.log('Role fetched successfully:', profileData.role);
          setUserRole(profileData.role);
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la vérification de la session",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    if (session) {
      checkSession();
    } else {
      setIsLoading(false);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_OUT' && mounted) {
        setUserRole(null);
        navigate('/login');
      } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && mounted) {
        checkSession();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [session, navigate, toast]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  if (!session) {
    console.log('No session, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole || '')) {
    console.log('User role not allowed:', userRole);
    return <Navigate to="/products" />;
  }

  if (excludedRoles && excludedRoles.includes(userRole || '')) {
    console.log('User role excluded:', userRole);
    return <Navigate to="/products" />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;