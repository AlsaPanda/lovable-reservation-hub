import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AuthStateHandler = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
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
      } else if (event === 'USER_DELETED') {
        console.log("User account was deleted");
        navigate("/login");
      } else if (event === 'USER_UPDATED') {
        console.log("User account was updated");
      } else if (event === 'PASSWORD_RECOVERY') {
        console.log("Password recovery requested");
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Session token was refreshed");
      } else if (event === 'INITIAL_SESSION') {
        console.log("Initial session loaded");
        if (!session) {
          console.log("No session, redirecting to login");
          navigate("/login");
        }
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return null;
};