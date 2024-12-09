import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Vérifie une seule fois la session au montage
  useEffect(() => {
    const checkInitialSession = async () => {
      console.log("Checking initial session...");
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          toast({
            title: "Erreur de session",
            description: "Impossible de vérifier votre session",
            variant: "destructive",
          });
          return;
        }

        if (session) {
          console.log("Initial session found:", session);
          navigate("/products");
        } else {
          console.log("No initial session found");
        }
      } catch (error) {
        console.error("Unexpected error during session check:", error);
        toast({
          title: "Erreur inattendue",
          description: "Une erreur est survenue lors de la vérification de votre session",
          variant: "destructive",
        });
      }
    };

    checkInitialSession();
  }, [navigate, toast]);

  // Gestion des changements d'état d'authentification
  useEffect(() => {
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in successfully:", session);
        toast({
          title: "Connexion réussie",
          description: "Vous allez être redirigé vers la page des produits",
        });
        navigate("/products");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            Schmidt & Cuisinella
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                button: {
                  background: 'rgb(var(--primary))',
                  color: 'white',
                  borderRadius: '0.375rem',
                },
                anchor: {
                  color: 'rgb(var(--primary))',
                },
                message: {
                  color: 'rgb(var(--destructive))',
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin + "/products"}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Mot de passe',
                  email_input_placeholder: 'Votre email',
                  password_input_placeholder: 'Votre mot de passe',
                  button_label: 'Se connecter',
                  loading_button_label: 'Connexion en cours ...',
                  social_provider_text: 'Se connecter avec {{provider}}',
                  link_text: "Vous avez déjà un compte ? Connectez-vous",
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Mot de passe',
                  email_input_placeholder: 'Votre email',
                  password_input_placeholder: 'Votre mot de passe',
                  button_label: "S'inscrire",
                  loading_button_label: 'Inscription en cours ...',
                  social_provider_text: "S'inscrire avec {{provider}}",
                  link_text: "Vous n'avez pas de compte ? Inscrivez-vous",
                },
                forgotten_password: {
                  link_text: "Mot de passe oublié ?",
                  button_label: "Envoyer les instructions",
                  loading_button_label: "Envoi en cours...",
                  email_label: "Email",
                  password_label: "Mot de passe",
                  email_input_placeholder: "Votre email",
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;