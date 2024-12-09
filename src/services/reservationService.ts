import { supabase } from "@/integrations/supabase/client";
import { Reservation } from "@/utils/types";

export const fetchReservations = async (userId: string, isSuperAdmin: boolean) => {
  // First fetch reservations with products
  let query = supabase
    .from('reservations')
    .select(`
      *,
      product:products(*)
    `)
    .order('reservation_date', { ascending: true });

  // Only filter by store_name if not a superadmin
  if (!isSuperAdmin) {
    query = query.eq('store_name', userId);
  }

  const { data: reservationsData, error: reservationsError } = await query;
  
  if (reservationsError) throw reservationsError;

  // Then fetch profiles separately
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*');

  if (profilesError) throw profilesError;

  // Create a map of profiles for easy lookup
  const profilesMap = new Map(profilesData.map(profile => [profile.id, profile]));

  // Combine the data
  const transformedData = reservationsData.map(reservation => ({
    ...reservation,
    store: profilesMap.get(reservation.store_name)
  }));

  return transformedData as Reservation[];
};

export const updateReservationInDb = async (
  updatedReservation: Partial<Reservation>,
  userId: string
) => {
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
  
  if (error) throw error;
  return data;
};

export const deleteReservationFromDb = async (id: string, userId: string) => {
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id)
    .eq('store_name', userId);
  
  if (error) throw error;
};