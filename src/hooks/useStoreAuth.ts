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
      
      // Check if store exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('store_id')
        .eq('store_id', storeId)
        .single()
        .headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-store-token': token
        });

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

      const normalizedBrand = normalizeBrand(brand);
      const storeEmail = generateStoreEmail(storeId);

      // Try to sign in
      const { error: signInError } = await signInStore(storeEmail, token);

      if (signInError) {
        console.log('Sign in failed:', signInError);
        
        // Create new account if store doesn't exist
        if (!existingProfile) {
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
          const { error: finalSignInError } = await signInStore(storeEmail, token);

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
          toast({
            variant: "destructive",
            title: "Erreur d'authentification",
            description: "Token invalide pour ce magasin",
          });
          navigate('/login');
          return;
        }
      }

      // Update store metadata if signed in
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
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