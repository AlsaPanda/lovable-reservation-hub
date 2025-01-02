import UserProfileInfo from "./UserProfileInfo";
import LogoutButton from "./LogoutButton";

type UserProfileProps = {
  storeName: string;
  storeId?: string;
  userRole?: string;
  email?: string;
};

const UserProfile = ({ storeName, storeId, userRole, email }: UserProfileProps) => {
  return (
    <div className="flex items-center gap-4">
      <UserProfileInfo 
        storeName={storeName}
        storeId={storeId}
        userRole={userRole}
        email={email}
      />
      <LogoutButton />
    </div>
  );
};

export default UserProfile;