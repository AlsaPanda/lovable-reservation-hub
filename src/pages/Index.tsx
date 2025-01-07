import { Button } from "@/components/ui/button";
import { getTokenForStore } from "@/utils/getStoreTokenDemo";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleGenerateToken = async () => {
    try {
      const token = await getTokenForStore('007');
      const loginUrl = `${window.location.origin}/login?sg_m=007&sg_p=${token}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(loginUrl);
      
      toast({
        title: "URL générée avec succès",
        description: "L'URL d'authentification a été copiée dans le presse-papier",
      });
      
      console.log('URL de connexion :', loginUrl);
    } catch (error) {
      console.error('Erreur lors de la génération du token:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le token",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Générateur de token pour le magasin 007</h1>
      <Button onClick={handleGenerateToken}>
        Générer un token pour le magasin 007
      </Button>
      <p className="mt-4 text-sm text-gray-600">
        Cliquez sur le bouton pour générer une URL d'authentification. 
        L'URL sera automatiquement copiée dans votre presse-papier.
      </p>
    </div>
  );
};

export default Index;