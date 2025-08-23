export interface PaymentTransaction {
  id: string;
  serviceName: string;
  amount: number;
  status: 'escrow' | 'released' | 'pending';
  date: string;
  clientId: string;
  clientName: string;
  contractorId: string;
  contractorName: string;
  description?: string;
}

export interface PaymentSummary {
  totalEarnings: number;
  pendingAmount: number;
  releasedAmount: number;
  transactionCount: number;
}