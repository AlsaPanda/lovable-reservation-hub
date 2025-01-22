import { Link } from "react-router-dom";
import NavigationLinks from "./navigation/NavigationLinks";
import UserProfile from "./navigation/UserProfile";
import { useUserProfile } from "@/hooks/useUserProfile";

const NavBar = () => {
  const { userRole, storeName, storeId, email, brand } = useUserProfile();

  const getLogoPath = (brand: string) => {
    if (brand === 'schmidt') {
      return '/lovable-uploads/f58f58b1-e042-4e92-aa8a-2fccb9247087.png';
    }
    return `/${brand}-logo.png`;
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="mr-6">
          <img 
            src={getLogoPath(brand)}
            alt={`${brand} logo`}
            className="h-8 w-auto object-contain"
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