import NavigationLinks from "./navigation/NavigationLinks";
import UserProfile from "./navigation/UserProfile";
import { useUserProfile } from "@/hooks/useUserProfile";

const NavBar = () => {
  const { userRole, storeName } = useUserProfile();

  return (
    <div className="border-b mb-6">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <NavigationLinks userRole={userRole} />
        <UserProfile storeName={storeName} />
      </div>
    </div>
  );
};

export default NavBar;