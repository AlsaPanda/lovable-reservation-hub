import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type UserProfileProps = {
  storeName: string;
};

const UserProfile = ({ storeName }: UserProfileProps) => {
  const handleLogout = () => {
    // Redirection simple vers la page de login
    // Cela forcera un rechargement complet et une réinitialisation de l'état
    window.location.href = '/login';
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