import { supabase } from "@/integrations/supabase/client";
import { Reservation } from "@/utils/types";

export const fetchReservations = async (userId: string | null, isSuperAdmin: boolean) => {
  console.log('Fetching reservations with params:', { userId, isSuperAdmin });
  
  if (!userId) {
    console.error('No userId provided');
    throw new Error('User not authenticated');
  }

  try {
    // For non-superadmin, first get their store_name
    if (!isSuperAdmin) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('store_name')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile?.store_name) throw new Error('Store not found');

      const { data, error } = await supabase
        .from('reservations')
        .select(`
          id,
          product_id,
          store_name,
          quantity,
          reservation_date,
          created_at,
          updated_at,
          product_name
        `)
        .eq('store_name', profile.store_name)
        .order('reservation_date', { ascending: false });

      if (error) throw error;
      return data;
    }

    // For superadmin, fetch all reservations
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        product_id,
        store_name,
        quantity,
        reservation_date,
        created_at,
        updated_at,
        product_name
      `)
      .order('reservation_date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in fetchReservations:', error);
    throw error;
  }
};

export const updateReservationInDb = async (
  reservation: Partial<Reservation>,
  userId: string
) => {
  console.log('Updating reservation:', reservation);
  const { data, error } = await supabase
    .from('reservations')
    .update({
      quantity: reservation.quantity,
      reservation_date: reservation.reservation_date
    })
    .eq('id', reservation.id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
  return data;
};

export const deleteReservationFromDb = async (id: string) => {
  console.log('Deleting reservation:', id);
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }

  return true;
};