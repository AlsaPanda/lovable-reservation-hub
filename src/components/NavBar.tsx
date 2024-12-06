import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();

  return (
    <div className="border-b mb-6">
      <div className="container mx-auto py-4">
        <NavigationMenu>
          <NavigationMenuList>
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
      </div>
    </div>
  );
};

export default NavBar;