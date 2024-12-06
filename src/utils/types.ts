export interface Product {
  reference: string;
  name: string;
  description: string;
  initialQuantity: number;
  imageUrl: string;
  availableQuantity: number;
}

export interface Reservation {
  reference: string;
  description: string;
  quantity: number;
  storeName: string;
  date: string;
}

export interface User {
  id: string;
  storeName: string;
  token: string;
}