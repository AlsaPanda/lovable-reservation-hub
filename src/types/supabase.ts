import { Database } from '@/integrations/supabase/types';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type ProfileResponse = Tables<'profiles'>;
export type ProductResponse = Tables<'products'>;
export type ReservationResponse = Tables<'reservations'>;
export type ContentBlockResponse = Tables<'content_blocks'>;

export type InsertProfile = InsertTables<'profiles'>;
export type InsertProduct = InsertTables<'products'>;
export type InsertReservation = InsertTables<'reservations'>;
export type InsertContentBlock = InsertTables<'content_blocks'>;

export type UpdateProfile = UpdateTables<'profiles'>;
export type UpdateProduct = UpdateTables<'products'>;
export type UpdateReservation = UpdateTables<'reservations'>;
export type UpdateContentBlock = UpdateTables<'content_blocks'>;