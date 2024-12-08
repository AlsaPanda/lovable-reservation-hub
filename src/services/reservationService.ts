import { supabase } from "@/integrations/supabase/client";
import { Reservation } from "@/utils/types";

export const fetchReservations = async (userId: string) => {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      product:products(*)
    `)
    .eq('store_name', userId)
    .order('reservation_date', { ascending: true })
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as Reservation[];
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