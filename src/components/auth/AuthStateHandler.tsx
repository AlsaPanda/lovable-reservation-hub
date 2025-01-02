import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AuthStateHandler = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // First check if we have an existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          // Clear any invalid session data
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
      } catch (err) {
        console.error("Session check failed:", err);
        navigate("/login");
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in successfully");
        toast({
          title: "Connexion réussie",
          description: "Vous allez être redirigé vers la page des produits",
        });
        navigate("/products");
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        navigate("/login");
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
        if (!session) {
          navigate("/login");
        }
      } else if (event === 'USER_UPDATED') {
        console.log("User data updated");
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return null;
};