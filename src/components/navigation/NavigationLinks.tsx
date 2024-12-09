import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";

type NavigationLinksProps = {
  userRole: string | null;
};

const NavigationLinks = ({ userRole }: NavigationLinksProps) => {
  const location = useLocation();

  return (
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
  );
};

export default NavigationLinks;