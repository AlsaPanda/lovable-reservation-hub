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
  const [hasError, setHasError] = React.useState(false);
  
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
          setHasError(true);
          setIsLoading(false);
          return;
        }
        
        setUserRole(data?.role);
      } catch (error) {
        console.error("Error in checkUserRole:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [session]);

  React.useEffect(() => {
    const handleSessionError = async () => {
      if (hasError) {
        try {
          // Nettoyage complet des données de session
          localStorage.clear();
          sessionStorage.clear();
          await supabase.auth.signOut();
        } catch (error) {
          console.error("Error during cleanup:", error);
        } finally {
          window.location.href = '/login';
        }
      }
    };

    handleSessionError();
  }, [hasError]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  if (!session) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole || '')) {
    return <Navigate to="/products" />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;