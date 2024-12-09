import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type UserProfileProps = {
  storeName: string;
};

const UserProfile = ({ storeName }: UserProfileProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Version simplifiée et plus sûre de la déconnexion
    supabase.auth.signOut()
      .then(({ error }) => {
        if (error) {
          console.error("Erreur de déconnexion:", error);
          toast({
            variant: "destructive",
            title: "Erreur de déconnexion",
            description: "Veuillez réessayer dans quelques instants.",
          });
        } else {
          // Redirection simple vers la page de login
          window.location.href = '/login';
        }
      })
      .catch((error) => {
        console.error("Exception lors de la déconnexion:", error);
        toast({
          variant: "destructive",
          title: "Erreur inattendue",
          description: "Un problème est survenu lors de la déconnexion.",
        });
      });
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">{storeName}</span>
      <Button 
        variant="outline" 
        onClick={handleLogout}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Déconnexion
      </Button>
    </div>
  );
};

export default UserProfile;