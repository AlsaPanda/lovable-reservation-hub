import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreAuthHandler } from "@/components/auth/StoreAuthHandler";
import { AuthStateHandler } from "@/components/auth/AuthStateHandler";

const Login = () => {
  const location = useLocation();
  const [urlParams, setUrlParams] = useState<{
    storeId?: string;
    token?: string;
    brand?: string;
    countryCode?: string;
    languageCode?: string;
    context?: string;
  }>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setUrlParams({
      storeId: searchParams.get('sg_m') || undefined,
      token: searchParams.get('sg_p') || undefined,
      brand: searchParams.get('brand') || undefined,
      countryCode: searchParams.get('sg_cp') || undefined,
      languageCode: searchParams.get('sg_l') || undefined,
      context: searchParams.get('sg_ct') || undefined,
    });
  }, [location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            Schmidt & Cuisinella
          </CardTitle>
        </CardHeader>
        <CardContent>
          {urlParams.storeId && urlParams.token ? (
            <StoreAuthHandler
              storeId={urlParams.storeId}
              token={urlParams.token}
              brand={urlParams.brand}
              countryCode={urlParams.countryCode}
              languageCode={urlParams.languageCode}
              context={urlParams.context}
            />
          ) : (
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
          )}
        </CardContent>
      </Card>
      <AuthStateHandler />
    </div>
  );
};

export default Login;