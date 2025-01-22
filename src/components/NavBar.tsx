import { Link } from "react-router-dom";
import NavigationLinks from "./navigation/NavigationLinks";
import UserProfile from "./navigation/UserProfile";
import { useUserProfile } from "@/hooks/useUserProfile";

const NavBar = () => {
  const { userRole, storeName, storeId, email, brand } = useUserProfile();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="mr-6">
          <img 
            src={`/${brand}-logo.png`}
            alt={`${brand} logo`}
            className="h-8 w-auto"
          />
        </Link>
        <NavigationLinks userRole={userRole} />
        <div className="ml-auto">
          <UserProfile 
            storeName={storeName} 
            storeId={storeId}
            userRole={userRole}
            email={email}
          />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;