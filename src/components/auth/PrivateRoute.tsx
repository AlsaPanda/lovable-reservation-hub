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
        // First verify we have a valid session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (isMounted) {
            await supabase.auth.signOut();
            navigate('/login');
            toast({
              variant: "destructive",
              title: "Session Error",
              description: "Please log in again",
            });
          }
          return;
        }

        if (!currentSession?.user?.id) {
          console.log('No active session found');
          if (isMounted) {
            setIsLoading(false);
            navigate('/login');
          }
          return;
        }

        // Then fetch the user role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentSession.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching user role:", profileError);
          if (profileError.code === 'PGRST301' || profileError.message?.includes('JWT')) {
            if (isMounted) {
              toast({
                variant: "destructive",
                title: "Session expired",
                description: "Please log in again",
              });
              await supabase.auth.signOut();
              navigate('/login');
            }
          } else {
            if (isMounted) {
              toast({
                variant: "destructive",
                title: "Error",
                description: "Unable to fetch your role",
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
            title: "Error",
            description: "An error occurred while checking your session",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (!session && isMounted) {
        navigate('/login');
      }
    });

    checkSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
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