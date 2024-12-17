import React from 'react';

type UserProfileInfoProps = {
  storeName: string;
  storeId?: string;
  userRole?: string;
  email?: string;
};

const UserProfileInfo = ({ storeName, storeId, userRole, email }: UserProfileInfoProps) => {
  return (
    <div className="flex flex-col items-end">
      <span className="text-sm font-medium">{storeName}</span>
      {userRole === 'superadmin' && (
        <span className="text-xs text-muted-foreground">
          {storeId || email}
        </span>
      )}
    </div>
  );
};

export default UserProfileInfo;