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
    // Log avant toute opération
    console.log("Tentative de déconnexion initiée");
    
    try {
      // Déconnexion synchrone pour éviter les problèmes de timing
      window.localStorage.removeItem('supabase.auth.token');
      console.log("Token local supprimé");
      
      // Ensuite seulement, on appelle la déconnexion Supabase
      supabase.auth.signOut()
        .then(() => {
          console.log("Déconnexion Supabase réussie");
          // Redirection forcée
          window.location.href = '/login';
        })
        .catch((error) => {
          console.error("Erreur lors de la déconnexion Supabase:", error);
          // En cas d'erreur, on force quand même la redirection
          window.location.href = '/login';
        });
    } catch (error) {
      console.error("Erreur critique lors de la déconnexion:", error);
      // En cas d'erreur critique, on force aussi la redirection
      window.location.href = '/login';
    }
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