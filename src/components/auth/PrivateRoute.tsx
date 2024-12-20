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
    let isMounted = true;
    
    const checkSession = async () => {
      try {
        if (!session?.user?.id) {
          console.log('No session or user ID available');
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }

        // First verify the session is still valid
        const { data: { session: currentSession }, error: sessionError } = 
          await supabase.auth.getSession();

        if (sessionError || !currentSession) {
          console.error("Session error:", sessionError);
          if (isMounted) {
            await supabase.auth.signOut();
            navigate('/login');
            toast({
              variant: "destructive",
              title: "Session expirée",
              description: "Veuillez vous reconnecter",
            });
          }
          return;
        }

        // Then fetch the profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentSession.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching user role:", profileError);
          if (profileError.code === 'PGRST116' || profileError.message?.includes('JWT')) {
            if (isMounted) {
              await supabase.auth.signOut();
              navigate('/login');
              toast({
                variant: "destructive",
                title: "Session expirée",
                description: "Veuillez vous reconnecter",
              });
            }
          } else {
            if (isMounted) {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de récupérer votre rôle",
              });
            }
          }
          return;
        }
        
        if (profileData && isMounted) {
          console.log('Role fetched successfully:', profileData.role);
          setUserRole(profileData.role);
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        if (isMounted) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la vérification de la session",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
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