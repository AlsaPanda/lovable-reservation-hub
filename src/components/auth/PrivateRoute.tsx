import React from "react";
import { Navigate } from "react-router-dom";
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
  
  React.useEffect(() => {
    const checkUserRole = async () => {
      if (!session?.user?.id) {
        console.log('No session or user ID available');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Fetching role for user:', session.user.id);
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          console.error("Session error:", sessionError);
          toast({
            variant: "destructive",
            title: "Erreur de session",
            description: "Veuillez vous reconnecter",
          });
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching user role:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer votre rôle",
          });
          setIsLoading(false);
          return;
        }
        
        if (data) {
          console.log('Role fetched successfully:', data.role);
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Error in checkUserRole:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [session, toast]);

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