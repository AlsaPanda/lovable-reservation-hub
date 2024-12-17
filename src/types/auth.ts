export type UserRole = 'user' | 'superadmin' | 'magasin';

export type Profile = {
  id: string;
  store_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  brand: 'schmidt' | 'cuisinella';
};