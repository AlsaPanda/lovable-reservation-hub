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
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session); // Debug log
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in successfully:', session.user); // Debug log
        toast({
          title: "Connexion réussie",
          description: "Vous allez être redirigé vers le tableau de bord",
        });
        navigate("/dashboard");
      }
      if (event === 'SIGNED_OUT') {
        console.log('User signed out'); // Debug log
        navigate("/");
      }
      if (event === 'USER_UPDATED') {
        console.log('User updated:', session);
      }
      // Add error handling
      if (event === 'USER_DELETED' || event === 'TOKEN_REFRESHED') {
        console.log('Auth event:', event);
      }
    });

    // Check current session on mount
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Current session:', session, 'Error:', error); // Debug log
      if (session) {
        navigate("/dashboard");
      }
      if (error) {
        console.error('Session check error:', error);
        toast({
          title: "Erreur de session",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    
    checkSession();

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