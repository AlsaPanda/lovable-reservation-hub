import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface StoreOrder {
  store_name: string;
  store_id: string;
  total_reservations: number;
  total_products: number;
  last_reservation: string;
}

export const useStoreOrders = () => {
  const [storeOrders, setStoreOrders] = useState<StoreOrder[]>([]);
  const { toast } = useToast();

  const fetchStoreOrders = async () => {
    try {
      // Fetch profiles for store IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('store_name, store_id');

      if (profilesError) throw profilesError;

      const storeIdMap = profiles?.reduce((acc: { [key: string]: string }, profile) => {
        if (profile.store_name && profile.store_id) {
          acc[profile.store_name] = profile.store_id;
        }
        return acc;
      }, {});

      // Fetch reservations with product names
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          store_name,
          quantity,
          reservation_date,
          product_name
        `);

      if (error) throw error;

      const ordersByStore = data?.reduce((acc: { [key: string]: StoreOrder }, curr) => {
        if (!acc[curr.store_name]) {
          acc[curr.store_name] = {
            store_name: curr.store_name,
            store_id: storeIdMap?.[curr.store_name] || 'N/A',
            total_reservations: 0,
            total_products: 0,
            last_reservation: curr.reservation_date
          };
        }
        acc[curr.store_name].total_reservations += 1;
        acc[curr.store_name].total_products += curr.quantity;
        
        // Update last reservation date if current one is more recent
        if (new Date(curr.reservation_date) > new Date(acc[curr.store_name].last_reservation)) {
          acc[curr.store_name].last_reservation = curr.reservation_date;
        }
        
        return acc;
      }, {});

      setStoreOrders(Object.values(ordersByStore || {}));
    } catch (error) {
      console.error('Error fetching store orders:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les commandes des magasins"
      });
    }
  };

  useEffect(() => {
    fetchStoreOrders();
  }, []);

  return { storeOrders, fetchStoreOrders };
};