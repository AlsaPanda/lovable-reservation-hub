import { supabase } from "@/integrations/supabase/client";
import { Reservation } from "@/utils/types";

export const fetchReservations = async (userId: string | null, isSuperAdmin: boolean) => {
  console.log('Fetching reservations with params:', { userId, isSuperAdmin });
  
  try {
    // First get the user's store_name from their profile
    if (!isSuperAdmin && userId) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('store_name')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      console.log('User profile data:', profileData);

      let query = supabase
        .from('reservations')
        .select(`
          *,
          product:products(*)
        `)
        .order('reservation_date', { ascending: false });

      // Only filter by store_name if not a superadmin
      if (!isSuperAdmin && profileData?.store_name) {
        query = query.eq('store_name', profileData.store_name);
      }

      const { data: reservationsData, error: reservationsError } = await query;

      if (reservationsError) {
        console.error('Error fetching reservations:', reservationsError);
        throw reservationsError;
      }

      console.log('Fetched reservations data:', reservationsData);
      return reservationsData as Reservation[];
    }

    // For superadmin, fetch all reservations
    const { data: reservationsData, error: reservationsError } = await supabase
      .from('reservations')
      .select(`
        *,
        product:products(*)
      `)
      .order('reservation_date', { ascending: false });

    if (reservationsError) {
      console.error('Error fetching reservations:', reservationsError);
      throw reservationsError;
    }

    console.log('Fetched reservations data:', reservationsData);
    return reservationsData as Reservation[];
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
    .update(reservation)
    .eq('id', reservation.id)
    .select();

  if (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
  return data;
};

export const deleteReservationFromDb = async (id: string, userId: string) => {
  console.log('Attempting to delete reservation:', { id, userId });
  
  try {
    // First verify the user has access to this reservation
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching reservation before delete:', fetchError);
      throw fetchError;
    }

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    // Perform the delete operation
    const { error: deleteError } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting reservation:', deleteError);
      throw deleteError;
    }

    console.log('Successfully deleted reservation:', id);
    return true;
  } catch (error) {
    console.error('Error in deleteReservationFromDb:', error);
    throw error;
  }
};