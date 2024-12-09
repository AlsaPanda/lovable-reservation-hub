import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type UserProfileProps = {
  storeName: string;
};

const UserProfile = ({ storeName }: UserProfileProps) => {
  const handleLogout = async () => {
    console.log("Déconnexion initiée");
    try {
      // 1. Supprimer tous les tokens de localStorage
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      }
      
      // 2. Forcer la déconnexion Supabase
      await supabase.auth.signOut();
      
      // 3. Vider le sessionStorage aussi
      sessionStorage.clear();
      
      // 4. Rediriger vers login avec un paramètre pour éviter la reconnexion
      window.location.href = '/login?action=logout';
      
    } catch (error) {
      console.error("Erreur critique lors de la déconnexion:", error);
      // En cas d'erreur, on force quand même la redirection
      window.location.href = '/login?action=logout';
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