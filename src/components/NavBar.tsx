import NavigationLinks from "./navigation/NavigationLinks";
import UserProfile from "./navigation/UserProfile";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { userRole, storeName, brand } = useUserProfile();

  const getLogo = () => {
    if (userRole === 'superadmin') {
      return "/lovable-uploads/f58f58b1-e042-4e92-aa8a-2fccb9247087.png"; // Schmidt Groupe logo
    }
    return brand === 'cuisinella' 
      ? "/cuisinella-logo.png"  // You'll need to add this image to public folder
      : "/schmidt-logo.png";    // You'll need to add this image to public folder
  };

  const getAltText = () => {
    if (userRole === 'superadmin') return "Schmidt Groupe";
    return brand === 'cuisinella' ? "Cuisinella" : "Schmidt";
  };

  return (
    <div className="border-b mb-6">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <img 
              src={getLogo()}
              alt={getAltText()}
              className="h-8 md:h-10"
            />
          </Link>
          <NavigationLinks userRole={userRole} />
        </div>
        <UserProfile storeName={storeName} />
      </div>
    </div>
  );
};

export default NavBar;