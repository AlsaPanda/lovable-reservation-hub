import React from 'react';
import { useSession } from "@supabase/auth-helpers-react";

interface UserProfileInfoProps {
  storeName?: string;
  storeId?: string;
  userRole?: string;
  email?: string;
}

const UserProfileInfo = ({ storeId, userRole, email }: UserProfileInfoProps) => {
  const session = useSession();
  
  // If there's no session, don't render anything
  if (!session) {
    return null;
  }

  const displayValue = userRole === 'magasin' 
    ? (storeId || email)
    : email;

  return (
    <div className="flex flex-col items-end">
      <span className="text-sm font-medium">{displayValue}</span>
    </div>
  );
};

export default UserProfileInfo;