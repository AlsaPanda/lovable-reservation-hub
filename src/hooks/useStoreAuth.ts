import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateStoreEmail, normalizeBrand, signInStore, signUpStore, updateStoreProfile } from "@/utils/authUtils";

export const useStoreAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStoreAuth = async (
    storeId: string,
    token: string,
    brand: string = 'cuisinella',
    countryCode: string = 'fr-FR',
    languageCode: string = 'fr',
    context: string = '0'
  ) => {
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

      // Generate store email and normalize brand before using them
      const storeEmail = generateStoreEmail(storeId);
      const normalizedBrand = normalizeBrand(brand);

      // First try to sign in
      const { data: { session }, error: signInError } = await signInStore(storeEmail, token);

      if (signInError) {
        console.log('Sign in failed:', signInError);
        
        // Create new account if store doesn't exist
        console.log('Creating new store account for:', storeId);
        const { error: signUpError } = await signUpStore(
          storeEmail,
          token,
          {
            store_id: storeId,
            brand: normalizedBrand,
            country_code: countryCode,
            language_code: languageCode,
            context,
            store_name: `Store ${storeId}`
          }
        );

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

        // Sign in after successful signup
        const { data: { session: newSession }, error: finalSignInError } = await signInStore(storeEmail, token);

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

        if (newSession?.user?.id) {
          const { error: updateError } = await updateStoreProfile(
            newSession.user.id,
            {
              brand: normalizedBrand,
              country_code: countryCode,
              language_code: languageCode,
              context
            }
          );

          if (updateError) {
            console.error('Error updating profile:', updateError);
          }
        }
      } else if (session?.user?.id) {
        // Update existing store metadata
        const { error: updateError } = await updateStoreProfile(
          session.user.id,
          {
            brand: normalizedBrand,
            country_code: countryCode,
            language_code: languageCode,
            context
          }
        );

        if (updateError) {
          console.error('Error updating profile:', updateError);
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

  return { handleStoreAuth };
};