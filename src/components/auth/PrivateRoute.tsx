import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const session = useSession();
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const checkUserRole = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching user role:", error);
          setIsLoading(false);
          return;
        }
        
        setUserRole(data?.role);
      } catch (error) {
        console.error("Error in checkUserRole:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [session]);
  
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);
      if (event === 'SIGNED_OUT') {
        // On s'assure que la session est bien supprimée
        supabase.auth.signOut();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  if (!session) {
    console.log("No session, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole || '')) {
    console.log("User role not authorized:", userRole);
    return <Navigate to="/products" />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;