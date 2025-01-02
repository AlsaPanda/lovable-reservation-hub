import { supabase } from "@/integrations/supabase/client";
import { Reservation } from "@/utils/types";

export const fetchReservations = async (userId: string, isSuperAdmin: boolean) => {
  console.log('Fetching reservations with params:', { userId, isSuperAdmin });
  
  try {
    // First fetch reservations with products
    let query = supabase
      .from('reservations')
      .select(`
        *,
        product:products(*)
      `)
      .order('reservation_date', { ascending: false });

    // Only filter by store_name if not a superadmin
    if (!isSuperAdmin) {
      query = query.eq('store_name', userId);
    }

    const { data: reservationsData, error: reservationsError } = await query;
    
    if (reservationsError) {
      console.error('Error fetching reservations:', reservationsError);
      throw reservationsError;
    }

    console.log('Fetched reservations data:', reservationsData);

    // Then fetch profiles separately
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    console.log('Fetched profiles data:', profilesData);

    // Create a map of profiles for easy lookup
    const profilesMap = new Map(profilesData.map(profile => [profile.id, profile]));

    // Combine the data
    const transformedData = reservationsData.map(reservation => ({
      ...reservation,
      store: profilesMap.get(reservation.store_name)
    }));

    console.log('Transformed reservations data:', transformedData);
    return transformedData as Reservation[];
  } catch (error) {
    console.error('Error in fetchReservations:', error);
    throw error;
  }
};

export const updateReservationInDb = async (
  updatedReservation: Partial<Reservation>,
  userId: string
) => {
  console.log('Updating reservation:', { updatedReservation, userId });
  
  if (!updatedReservation.id) throw new Error('Missing reservation ID');

  const { data, error } = await supabase
    .from('reservations')
    .update({
      quantity: updatedReservation.quantity,
      reservation_date: updatedReservation.reservation_date
    })
    .eq('id', updatedReservation.id)
    .eq('store_name', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
  
  console.log('Updated reservation:', data);
  return data;
};

export const deleteReservationFromDb = async (id: string, userId: string) => {
  console.log('Deleting reservation:', { id, userId });
  
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id)
    .eq('store_name', userId);
  
  if (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
  
  console.log('Reservation deleted successfully');
};