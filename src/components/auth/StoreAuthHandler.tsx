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
        console.log('Attempting store authentication with:', { storeId, token, brand });
        
        // Normalize brand name
        const normalizedBrand = brand === 'sch' ? 'schmidt' : brand;
        
        // Generate store email (consistent format for both new and existing stores)
        const storeEmail = `${storeId}@store.cuisinella.fr`;

        // Try to sign in first
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: storeEmail,
          password: token,
        });

        // If sign in fails, try to create a new account
        if (signInError) {
          console.log('Sign in failed, attempting to create new account:', signInError);
          
          // Check if the store exists in profiles
          const { data: existingProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('store_id', storeId)
            .single();

          if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error checking store profile:', profileError);
            toast({
              variant: "destructive",
              title: "Erreur d'authentification",
              description: "Impossible de vérifier le magasin",
            });
            return;
          }

          if (!existingProfile) {
            // Create new user if store doesn't exist
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
              return;
            }
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
      }
    };

    if (storeId && token) {
      handleStoreAuth();
    }
  }, [storeId, token, brand, countryCode, languageCode, context, navigate, toast]);

  return null;
};