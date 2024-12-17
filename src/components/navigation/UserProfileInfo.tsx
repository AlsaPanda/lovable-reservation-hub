import React from 'react';

type UserProfileInfoProps = {
  storeName: string;
  storeId?: string;
  userRole?: string;
  email?: string;
};

const UserProfileInfo = ({ storeName, storeId, userRole, email }: UserProfileInfoProps) => {
  const displayText = storeId || storeName;

  return (
    <div className="flex flex-col items-end">
      <span className="text-sm font-medium">{displayText}</span>
    </div>
  );
};

export default UserProfileInfo;