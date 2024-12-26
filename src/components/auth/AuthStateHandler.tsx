import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AuthStateHandler = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const redirectInProgress = useRef(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error("Session check error:", error);
          await supabase.auth.signOut();
          navigate("/login");
          return;
        }

        if (!session) {
          console.log("No active session found");
          navigate("/login");
          return;
        }

        console.log("Active session found:", session.user?.id);
        if (!redirectInProgress.current) {
          redirectInProgress.current = true;
          navigate("/products");
        }
      } catch (err) {
        console.error("Session check failed:", err);
        if (mounted) {
          navigate("/login");
        }
      }
    };

    // Initial session check
    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log("Auth state changed:", event, session?.user?.id);
      
      switch (event) {
        case 'SIGNED_IN':
          if (session && !redirectInProgress.current) {
            console.log("User signed in successfully");
            redirectInProgress.current = true;
            toast({
              title: "Connexion réussie",
              description: "Vous allez être redirigé vers la page des produits",
            });
            navigate("/products");
          }
          break;
          
        case 'SIGNED_OUT':
          console.log("User signed out");
          redirectInProgress.current = false;
          navigate("/login");
          break;
          
        case 'TOKEN_REFRESHED':
          console.log("Token refreshed successfully");
          if (!session) {
            navigate("/login");
          }
          break;
          
        case 'USER_UPDATED':
          console.log("User data updated");
          break;
          
        default:
          if (!session) {
            navigate("/login");
          }
      }
    });

    return () => {
      mounted = false;
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
      redirectInProgress.current = false;
    };
  }, [navigate, toast]);

  return null;
};