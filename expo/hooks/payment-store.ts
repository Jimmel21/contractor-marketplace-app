import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { PaymentTransaction, PaymentSummary } from '@/types/payment';

const mockTransactions: PaymentTransaction[] = [
  {
    id: 'txn_001',
    serviceName: 'Website Development',
    amount: 1500,
    status: 'released',
    date: '2024-01-15T10:30:00Z',
    clientId: 'client_001',
    clientName: 'Sarah Johnson',
    contractorId: 'current',
    contractorName: 'John Doe',
    description: 'Full-stack web development project'
  },
  {
    id: 'txn_002',
    serviceName: 'Mobile App UI Design',
    amount: 800,
    status: 'escrow',
    date: '2024-01-20T14:15:00Z',
    clientId: 'client_002',
    clientName: 'Mike Chen',
    contractorId: 'current',
    contractorName: 'John Doe',
    description: 'iOS and Android app design'
  },
  {
    id: 'txn_003',
    serviceName: 'Logo Design',
    amount: 350,
    status: 'released',
    date: '2024-01-10T09:45:00Z',
    clientId: 'client_003',
    clientName: 'Emma Wilson',
    contractorId: 'current',
    contractorName: 'John Doe',
    description: 'Brand identity and logo creation'
  },
  {
    id: 'txn_004',
    serviceName: 'Content Writing',
    amount: 200,
    status: 'pending',
    date: '2024-01-25T16:20:00Z',
    clientId: 'client_004',
    clientName: 'David Brown',
    contractorId: 'current',
    contractorName: 'John Doe',
    description: 'Blog posts and website content'
  },
  {
    id: 'txn_005',
    serviceName: 'E-commerce Setup',
    amount: 1200,
    status: 'released',
    date: '2024-01-05T11:00:00Z',
    clientId: 'client_005',
    clientName: 'Lisa Garcia',
    contractorId: 'current',
    contractorName: 'John Doe',
    description: 'Shopify store setup and customization'
  },
  {
    id: 'txn_006',
    serviceName: 'SEO Optimization',
    amount: 600,
    status: 'escrow',
    date: '2024-01-22T13:30:00Z',
    clientId: 'client_006',
    clientName: 'Tom Anderson',
    contractorId: 'current',
    contractorName: 'John Doe',
    description: 'Website SEO audit and optimization'
  }
];

export const [PaymentProvider, usePayments] = createContextHook(() => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const stored = await AsyncStorage.getItem('payment_transactions');
      if (stored) {
        setTransactions(JSON.parse(stored));
      } else {
        setTransactions(mockTransactions);
        await AsyncStorage.setItem('payment_transactions', JSON.stringify(mockTransactions));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions(mockTransactions);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = useCallback(async (transaction: PaymentTransaction) => {
    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    
    try {
      await AsyncStorage.setItem('payment_transactions', JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  }, [transactions]);

  const updateTransactionStatus = useCallback(async (transactionId: string, status: PaymentTransaction['status']) => {
    const updatedTransactions = transactions.map(txn => 
      txn.id === transactionId ? { ...txn, status } : txn
    );
    setTransactions(updatedTransactions);
    
    try {
      await AsyncStorage.setItem('payment_transactions', JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  }, [transactions]);

  const getContractorTransactions = useCallback((contractorId: string): PaymentTransaction[] => {
    return transactions.filter(txn => txn.contractorId === contractorId);
  }, [transactions]);

  const getPaymentSummary = useCallback((contractorId: string): PaymentSummary => {
    const contractorTxns = getContractorTransactions(contractorId);
    
    const totalEarnings = contractorTxns
      .filter(txn => txn.status === 'released')
      .reduce((sum, txn) => sum + txn.amount, 0);
    
    const pendingAmount = contractorTxns
      .filter(txn => txn.status === 'pending')
      .reduce((sum, txn) => sum + txn.amount, 0);
    
    const releasedAmount = contractorTxns
      .filter(txn => txn.status === 'released')
      .reduce((sum, txn) => sum + txn.amount, 0);
    
    return {
      totalEarnings,
      pendingAmount,
      releasedAmount,
      transactionCount: contractorTxns.length
    };
  }, [getContractorTransactions]);

  return useMemo(() => ({
    transactions,
    isLoading,
    addTransaction,
    updateTransactionStatus,
    getContractorTransactions,
    getPaymentSummary
  }), [transactions, isLoading, addTransaction, updateTransactionStatus, getContractorTransactions, getPaymentSummary]);
});