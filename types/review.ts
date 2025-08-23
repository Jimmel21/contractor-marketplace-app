export interface Review {
  id: string;
  serviceId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}