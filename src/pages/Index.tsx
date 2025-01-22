import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTokenForStore } from "@/utils/getStoreTokenDemo";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Index = () => {
  const { toast } = useToast();
  const [storeId, setStoreId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateToken = async () => {
    if (!storeId.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer un ID de magasin",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const token = await getTokenForStore(storeId);
      
      const params = new URLSearchParams({
        sg_m: storeId,
        sg_p: token,
        sg_cp: 'fr-FR',
        sg_l: 'fr',
        sg_ct: '0',
        brand: 'cuisinella'
      });
      
      const loginUrl = `${window.location.origin}/login?${params.toString()}`;
      
      await navigator.clipboard.writeText(loginUrl);
      
      toast({
        title: "URL générée avec succès",
        description: "L'URL d'authentification a été copiée dans le presse-papier",
      });
      
      console.log('URL de connexion générée:', loginUrl);
    } catch (error) {
      console.error('Erreur lors de la génération du token:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le token",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Générateur de token</h1>
      
      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label htmlFor="storeId" className="text-sm font-medium">
            ID du magasin
          </label>
          <Input
            id="storeId"
            type="text"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            placeholder="Entrez l'ID du magasin"
          />
        </div>

        <Button 
          onClick={handleGenerateToken} 
          className="w-full"
          disabled={isGenerating}
        >
          {isGenerating ? 'Génération...' : `Générer un token pour le magasin ${storeId || ''}`}
        </Button>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Entrez l'ID du magasin et cliquez sur le bouton pour générer une URL d'authentification complète. 
        L'URL sera automatiquement copiée dans votre presse-papier.
      </p>
    </div>
  );
};

export default Index;