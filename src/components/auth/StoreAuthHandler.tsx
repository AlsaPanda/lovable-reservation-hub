import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StoreAuthHandlerProps {
  storeId: string;
  token: string;
  brand?: string;
  countryCode?: string;
  languageCode?: string;
  context?: string;
}

export const StoreAuthHandler = ({
  storeId,
  token,
  brand = 'cuisinella',
  countryCode = 'fr-FR',
  languageCode = 'fr',
  context = '0'
}: StoreAuthHandlerProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleStoreAuth = async () => {
      try {
        // Input validation
        if (!storeId || !token || storeId.length < 3 || token.length < 32) {
          console.error('Invalid store ID or token format');
          toast({
            variant: "destructive",
            title: "Erreur d'authentification",
            description: "Identifiants invalides",
          });
          navigate('/login');
          return;
        }

        console.log('Attempting store authentication with:', { storeId, brand });
        
        // First check if the store exists and validate token
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('store_id')
          .eq('store_id', storeId)
          .single();

        // If there's an error other than "no rows found"
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking store profile:', profileError);
          toast({
            variant: "destructive",
            title: "Erreur d'authentification",
            description: "Impossible de vérifier le magasin",
          });
          navigate('/login');
          return;
        }
        
        // Normalize brand name
        const normalizedBrand = brand === 'sch' ? 'schmidt' : brand;
        
        // Generate store email (consistent format for both new and existing stores)
        const storeEmail = `${storeId}@store.cuisinella.fr`;

        // Try to sign in first
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: storeEmail,
          password: token,
        });

        if (signInError) {
          console.log('Sign in failed:', signInError);
          
          if (signInError.message.includes('Invalid login credentials')) {
            toast({
              variant: "destructive",
              title: "Erreur d'authentification",
              description: "Identifiants invalides",
            });
            navigate('/login');
            return;
          }

          // Only attempt to create a new account if the store doesn't exist
          if (!existingProfile) {
            // Create new user
            const { error: signUpError } = await supabase.auth.signUp({
              email: storeEmail,
              password: token,
              options: {
                data: {
                  store_id: storeId,
                  brand: normalizedBrand,
                  country_code: countryCode,
                  language_code: languageCode,
                  context,
                  role: 'magasin'
                }
              }
            });

            if (signUpError) {
              console.error('Sign up error:', signUpError);
              toast({
                variant: "destructive",
                title: "Erreur de création",
                description: "Impossible de créer le compte magasin",
              });
              navigate('/login');
              return;
            }

            // Try to sign in after successful signup
            const { error: finalSignInError } = await supabase.auth.signInWithPassword({
              email: storeEmail,
              password: token,
            });

            if (finalSignInError) {
              console.error('Final sign in error:', finalSignInError);
              toast({
                variant: "destructive",
                title: "Erreur de connexion",
                description: "Impossible de connecter le magasin après création",
              });
              navigate('/login');
              return;
            }
          } else {
            // If store exists but sign-in failed, it means the token is invalid
            toast({
              variant: "destructive",
              title: "Erreur d'authentification",
              description: "Token invalide pour ce magasin",
            });
            navigate('/login');
            return;
          }
        }

        // If we get here, we're successfully signed in
        // Update the store's metadata if it exists
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              brand: normalizedBrand,
              country_code: countryCode,
              language_code: languageCode,
              context
            })
            .eq('id', session.user.id);

          if (updateError) {
            console.error('Error updating profile:', updateError);
            // Don't block the login if update fails
          }
        }

        navigate('/products');
      } catch (error) {
        console.error('Store auth error:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'authentification",
        });
        navigate('/login');
      }
    };

    if (storeId && token) {
      handleStoreAuth();
    } else {
      navigate('/login');
    }
  }, [storeId, token, brand, countryCode, languageCode, context, navigate, toast]);

  return null;
};