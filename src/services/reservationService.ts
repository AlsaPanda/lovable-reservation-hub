import { supabase } from "@/integrations/supabase/client";
import { Reservation } from "@/utils/types";

export const fetchReservations = async (userId: string, isSuperAdmin: boolean) => {
  let query = supabase
    .from('reservations')
    .select(`
      *,
      product:products(*),
      store:profiles!inner(id, store_name, role, created_at, updated_at)
    `)
    .order('reservation_date', { ascending: true });

  // Only filter by store_name if not a superadmin
  if (!isSuperAdmin) {
    query = query.eq('store_name', userId);
  }

  const { data, error } = await query;
  
  if (error) throw error;

  // Transform the data to match our Reservation type
  const transformedData = data.map(item => ({
    ...item,
    store: Array.isArray(item.store) ? item.store[0] : item.store
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