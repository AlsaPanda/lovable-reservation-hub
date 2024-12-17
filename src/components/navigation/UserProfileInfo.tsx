import React from 'react';

type UserProfileInfoProps = {
  storeName: string;
  storeId?: string;
  userRole?: string;
  email?: string;
};

const UserProfileInfo = ({ storeId, userRole, email }: UserProfileInfoProps) => {
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