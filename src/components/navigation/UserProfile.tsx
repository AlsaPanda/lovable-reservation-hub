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
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erreur lors de la déconnexion:", error);
      }
      // On attend que la déconnexion soit effectuée avant de rediriger
      window.location.href = '/login';
    } catch (error) {
      console.error("Erreur critique lors de la déconnexion:", error);
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