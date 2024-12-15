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
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !currentSession) {
          console.error("Session error:", sessionError);
          toast({
            variant: "destructive",
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
          });
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        if (!currentSession.user?.id) {
          console.log('No user ID in session');
          navigate('/login');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentSession.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching user role:", profileError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer votre rôle",
          });
          return;
        }
        
        if (profileData) {
          console.log('Role fetched successfully:', profileData.role);
          setUserRole(profileData.role);
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

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