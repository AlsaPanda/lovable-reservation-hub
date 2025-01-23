import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AuthStateHandler = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in successfully");
        try {
          // Verify the session is valid by making a test query
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error("Profile fetch error:", error);
            if (error.code === 'PGRST301') {
              await supabase.auth.signOut();
              toast({
                variant: "destructive",
                title: "Erreur de session",
                description: "Veuillez vous reconnecter",
              });
              navigate("/login");
              return;
            }
          }
          
          toast({
            title: "Connexion réussie",
            description: "Vous allez être redirigé vers la page des produits",
          });
          navigate("/products");
        } catch (error) {
          console.error("Auth verification error:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la vérification de votre session",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        navigate("/login");
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return null;
};