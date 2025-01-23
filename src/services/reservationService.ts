import { supabase } from "@/integrations/supabase/client";
import { Reservation } from "@/utils/types";

export const fetchReservations = async (userId: string | null, isSuperAdmin: boolean) => {
  console.log('Fetching reservations with params:', { userId, isSuperAdmin });
  
  try {
    if (!userId) {
      console.error('No userId provided');
      throw new Error('User not authenticated');
    }

    // First get the user's store_name from their profile
    if (!isSuperAdmin) {
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

      // Fetch reservations with a single query
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select(`
          id,
          product_id,
          store_name,
          quantity,
          reservation_date,
          created_at,
          updated_at,
          product_name,
          product:products (
            id,
            name,
            brand,
            image_url,
            reference,
            created_at,
            updated_at,
            description,
            product_url,
            sale_price_ttc,
            initial_quantity,
            purchase_price_ht
          )
        `)
        .eq('store_name', profileData.store_name)
        .order('reservation_date', { ascending: false });

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
        id,
        product_id,
        store_name,
        quantity,
        reservation_date,
        created_at,
        updated_at,
        product_name,
        product:products (
          id,
          name,
          brand,
          image_url,
          reference,
          created_at,
          updated_at,
          description,
          product_url,
          sale_price_ttc,
          initial_quantity,
          purchase_price_ht
        )
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
    .select('*')
    .single();

  if (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
  return data;
};

export const deleteReservationFromDb = async (id: string, userId: string) => {
  console.log('Deleting reservation:', id);
  try {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteReservationFromDb:', error);
    throw error;
  }
};