import { Product, Reservation } from "@/utils/types";

export const groupReservationsByStore = (reservations: Reservation[]) => {
  return reservations.reduce((acc, reservation) => {
    const storeName = reservation.store_name;
    if (!acc[storeName]) {
      acc[storeName] = [];
    }
    acc[storeName].push(reservation);
    return acc;
  }, {} as Record<string, Reservation[]>);
};

export const sortReservationsByDate = (reservations: Reservation[]) => {
  return [...reservations].sort((a, b) => 
    new Date(b.reservation_date).getTime() - new Date(a.reservation_date).getTime()
  );
};

export const getUniqueProducts = (productsToReserve: Product[]) => {
  return productsToReserve.reduce((acc: Product[], current) => {
    const exists = acc.find(item => item.reference === current.reference);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);
};