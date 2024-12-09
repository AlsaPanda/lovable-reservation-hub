import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string>("");

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, store_name')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setUserRole(data.role);
          setStoreName(data.store_name);
        }
      }
    };

    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
      });
    }
  };

  return (
    <div className="border-b mb-6">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <NavigationMenu>
          <NavigationMenuList>
            {(userRole === 'admin' || userRole === 'superadmin') && (
              <NavigationMenuItem>
                <Link to="/dashboard">
                  <NavigationMenuLink 
                    className={navigationMenuTriggerStyle()}
                    active={location.pathname === '/dashboard'}
                  >
                    Tableau de bord
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <Link to="/products">
                <NavigationMenuLink 
                  className={navigationMenuTriggerStyle()}
                  active={location.pathname === '/products'}
                >
                  Produits
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/reservations">
                <NavigationMenuLink 
                  className={navigationMenuTriggerStyle()}
                  active={location.pathname === '/reservations'}
                >
                  Réservations
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
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
      </div>
    </div>
  );
};

export default NavBar;