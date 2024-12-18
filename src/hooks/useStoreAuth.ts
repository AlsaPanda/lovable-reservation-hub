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
        console.error('Invalid store ID or token format:', { storeId, tokenLength: token?.length });
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: "Identifiants invalides",
        });
        navigate('/login');
        return;
      }

      console.log('Attempting store authentication with:', { storeId, brand });
      
      // Preserve original storeId format (including leading zeros)
      const originalStoreId = storeId;
      
      // Check if store exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('store_id')
        .eq('store_id', originalStoreId)
        .single();

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
      const storeEmail = generateStoreEmail(originalStoreId);

      // Try to sign in
      const { data: signInData, error: signInError } = await signInStore(storeEmail, token);

      if (signInError) {
        console.log('Sign in attempt failed:', signInError);
        
        if (signInError.message.includes('Invalid login credentials')) {
          console.log('Invalid credentials, checking if store needs to be created');
          
          // Create new account if store doesn't exist
          if (!existingProfile) {
            console.log('Creating new store account');
            const { data: signUpData, error: signUpError } = await signUpStore(
              storeEmail,
              token,
              {
                store_id: originalStoreId,
                brand: normalizedBrand,
                country_code: countryCode,
                language_code: languageCode,
                context,
              }
            );

            if (signUpError) {
              console.error('Store signup failed:', signUpError);
              toast({
                variant: "destructive",
                title: "Erreur de création",
                description: "Impossible de créer le compte magasin",
              });
              navigate('/login');
              return;
            }

            console.log('Store account created successfully:', signUpData);

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
            console.log('Store exists but token is invalid');
            toast({
              variant: "destructive",
              title: "Erreur d'authentification",
              description: "Token invalide pour ce magasin",
            });
            navigate('/login');
            return;
          }
        }
      } else {
        console.log('Sign in successful:', signInData);
      }

      // Update store metadata if signed in
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('Updating store profile with new metadata');
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