import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Stack, router } from 'expo-router';
import {
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Filter
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/auth-store';
import { usePayments } from '@/hooks/payment-store';
import { PaymentTransaction } from '@/types/payment';

type FilterType = 'all' | 'released' | 'escrow' | 'pending';

export default function PaymentHistoryScreen() {
  const { user } = useAuth();
  const { getContractorTransactions, getPaymentSummary, isLoading } = usePayments();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  if (!user || user.type !== 'contractor') {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Payment History',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color="#1a1a1a" />
              </TouchableOpacity>
            )
          }} 
        />
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color="#FF4444" />
          <Text style={styles.errorTitle}>Access Denied</Text>
          <Text style={styles.errorSubtitle}>
            Payment history is only available for contractors
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const transactions = getContractorTransactions(user.id);
  const summary = getPaymentSummary(user.id);

  const filteredTransactions = transactions.filter(txn => {
    if (activeFilter === 'all') return true;
    return txn.status === activeFilter;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: PaymentTransaction['status']) => {
    switch (status) {
      case 'released': return '#1DBF73';
      case 'escrow': return '#FF9500';
      case 'pending': return '#666';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: PaymentTransaction['status']) => {
    switch (status) {
      case 'released': return CheckCircle;
      case 'escrow': return Clock;
      case 'pending': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: transactions.length },
    { key: 'released', label: 'Released', count: transactions.filter(t => t.status === 'released').length },
    { key: 'escrow', label: 'In Escrow', count: transactions.filter(t => t.status === 'escrow').length },
    { key: 'pending', label: 'Pending', count: transactions.filter(t => t.status === 'pending').length }
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Payment History',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color="#1a1a1a" />
              </TouchableOpacity>
            )
          }} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DBF73" />
          <Text style={styles.loadingText}>Loading payment history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Payment History',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#1a1a1a" />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <LinearGradient
            colors={['#1DBF73', '#17A85C']}
            style={styles.totalEarningsCard}
          >
            <View style={styles.summaryHeader}>
              <TrendingUp size={24} color="white" />
              <Text style={styles.summaryTitle}>Total Earnings</Text>
            </View>
            <Text style={styles.totalAmount}>{formatCurrency(summary.totalEarnings)}</Text>
            <Text style={styles.summarySubtitle}>
              From {summary.transactionCount} completed {summary.transactionCount === 1 ? 'transaction' : 'transactions'}
            </Text>
          </LinearGradient>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryCardHeader}>
                <Clock size={20} color="#FF9500" />
                <Text style={styles.summaryCardTitle}>In Escrow</Text>
              </View>
              <Text style={styles.summaryCardAmount}>
                {formatCurrency(transactions.filter(t => t.status === 'escrow').reduce((sum, t) => sum + t.amount, 0))}
              </Text>
            </View>
            
            <View style={styles.summaryCard}>
              <View style={styles.summaryCardHeader}>
                <AlertCircle size={20} color="#666" />
                <Text style={styles.summaryCardTitle}>Pending</Text>
              </View>
              <Text style={styles.summaryCardAmount}>
                {formatCurrency(summary.pendingAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Filter size={20} color="#666" />
            <Text style={styles.filterTitle}>Filter Transactions</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterTabs}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterTab,
                  activeFilter === filter.key && styles.activeFilterTab
                ]}
                onPress={() => setActiveFilter(filter.key)}
              >
                <Text style={[
                  styles.filterTabText,
                  activeFilter === filter.key && styles.activeFilterTabText
                ]}>
                  {filter.label}
                </Text>
                <View style={[
                  styles.filterBadge,
                  activeFilter === filter.key && styles.activeFilterBadge
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    activeFilter === filter.key && styles.activeFilterBadgeText
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>
            {activeFilter === 'all' ? 'All Transactions' : `${filters.find(f => f.key === activeFilter)?.label} Transactions`}
            <Text style={styles.sectionCount}> ({filteredTransactions.length})</Text>
          </Text>
          
          {filteredTransactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {filteredTransactions.map((transaction) => {
                const StatusIcon = getStatusIcon(transaction.status);
                const statusColor = getStatusColor(transaction.status);
                
                return (
                  <View key={transaction.id} style={styles.transactionCard}>
                    <View style={styles.transactionHeader}>
                      <View style={styles.transactionInfo}>
                        <Text style={styles.serviceName} numberOfLines={1}>
                          {transaction.serviceName}
                        </Text>
                        <Text style={styles.clientName}>
                          Client: {transaction.clientName}
                        </Text>
                      </View>
                      
                      <View style={styles.transactionAmount}>
                        <Text style={styles.amount}>
                          {formatCurrency(transaction.amount)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.transactionFooter}>
                      <View style={styles.transactionDate}>
                        <Calendar size={14} color="#999" />
                        <Text style={styles.dateText}>
                          {formatDate(transaction.date)}
                        </Text>
                      </View>
                      
                      <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
                        <StatusIcon size={14} color={statusColor} />
                        <Text style={[styles.statusText, { color: statusColor }]}>
                          {transaction.status === 'escrow' ? 'In Escrow' : 
                           transaction.status === 'released' ? 'Released' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                    
                    {transaction.description && (
                      <Text style={styles.description} numberOfLines={2}>
                        {transaction.description}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <DollarSign size={48} color="#E0E0E0" />
              <Text style={styles.emptyTitle}>
                No {activeFilter === 'all' ? '' : activeFilter} transactions
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeFilter === 'all' 
                  ? 'Complete your first service to see payment history'
                  : `You don't have any ${activeFilter} transactions yet`
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  summarySection: {
    padding: 20,
    paddingBottom: 0,
  },
  totalEarningsCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
  },
  summaryCardAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  filterSection: {
    padding: 20,
    paddingBottom: 0,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  filterTabs: {
    flexDirection: 'row',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterTab: {
    backgroundColor: '#1DBF73',
    borderColor: '#1DBF73',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginRight: 6,
  },
  activeFilterTabText: {
    color: 'white',
  },
  filterBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeFilterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterBadgeText: {
    color: 'white',
  },
  transactionsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  sectionCount: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1DBF73',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});