import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type UserProfileProps = {
  storeName: string;
  storeId?: string;
  userRole?: string;
  email?: string;
};

const UserProfile = ({ storeName, storeId, userRole, email }: UserProfileProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("User logged out successfully");
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{storeName}</span>
        {userRole === 'superadmin' && (storeId || email) && (
          <span className="text-xs text-muted-foreground">
            {storeId || email}
          </span>
        )}
      </div>
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