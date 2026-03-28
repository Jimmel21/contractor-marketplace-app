export interface Review {
  id: string;
  serviceId?: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  revieweeId: string;
  revieweeName: string;
  revieweeAvatar?: string;
  reviewerType: 'client' | 'contractor';
  rating: number;
  comment: string;
  date: string;
}