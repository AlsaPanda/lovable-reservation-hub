import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type UserProfileProps = {
  storeName: string;
};

const UserProfile = ({ storeName }: UserProfileProps) => {
  const handleLogout = async () => {
    try {
      // Nettoyage complet avant la déconnexion
      localStorage.clear();
      sessionStorage.clear();
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
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