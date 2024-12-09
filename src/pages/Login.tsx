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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      
      switch(event) {
        case 'SIGNED_IN':
          if (session) {
            console.log('User signed in successfully:', session.user);
            toast({
              title: "Connexion réussie",
              description: "Vous allez être redirigé vers la page des produits",
            });
            navigate("/products");
          }
          break;
        
        case 'SIGNED_OUT':
          console.log('User signed out');
          break;
        
        case 'USER_UPDATED':
          console.log('User profile updated:', session);
          break;
        
        case 'PASSWORD_RECOVERY':
          toast({
            title: "Réinitialisation du mot de passe",
            description: "Veuillez vérifier votre email",
          });
          break;
        
        default:
          console.log('Auth event:', event);
      }
    });

    return () => {
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