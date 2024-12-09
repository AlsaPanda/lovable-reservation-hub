import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  excludedRoles?: string[];
}

const PrivateRoute = ({ children, allowedRoles, excludedRoles }: PrivateRouteProps) => {
  const session = useSession();
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const checkUserRole = async () => {
      if (!session?.user?.id) {
        console.log('No session or user ID available');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Fetching role for user:', session.user.id);
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
        
        if (data) {
          console.log('Role fetched successfully:', data.role);
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Error in checkUserRole:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [session]);

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