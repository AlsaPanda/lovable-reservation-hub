import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleStoreAuth = async () => {
      const searchParams = new URLSearchParams(location.search);
      const storeId = searchParams.get('sg_m');
      const token = searchParams.get('sg_p');
      const countryCode = searchParams.get('sg_cp');
      const languageCode = searchParams.get('sg_l');
      const context = searchParams.get('sg_ct');
      const brand = searchParams.get('brand');

      if (storeId && token) {
        console.log('Attempting store authentication with:', { storeId, token });
        
        try {
          // First, try to authenticate using the store token
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('store_id', storeId)
            .single();

          if (profileError) {
            console.error('Error fetching store profile:', profileError);
            toast({
              variant: "destructive",
              title: "Erreur d'authentification",
              description: "Impossible de trouver le magasin",
            });
            return;
          }

          if (profileData) {
            // Sign in with store credentials
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: `${storeId}@store.cuisinella.fr`,
              password: token,
            });

            if (signInError) {
              console.error('Sign in error:', signInError);
              toast({
                variant: "destructive",
                title: "Erreur de connexion",
                description: "Identifiants invalides",
              });
              return;
            }

            // Update profile with latest context
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                country_code: countryCode || 'fr-FR',
                language_code: languageCode || 'fr',
                context: context || '0',
                brand: brand || 'cuisinella'
              })
              .eq('store_id', storeId);

            if (updateError) {
              console.error('Error updating profile:', updateError);
            }

            navigate('/products');
          }
        } catch (error) {
          console.error('Store auth error:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de l'authentification",
          });
        }
      }
    };

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
          console.log("Initial session found, redirecting to products");
          navigate("/products");
        } else {
          console.log("No initial session found");
          handleStoreAuth();
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
  }, [navigate, location.search, toast]);

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
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