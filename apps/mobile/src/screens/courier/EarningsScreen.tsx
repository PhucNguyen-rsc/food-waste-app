import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import CourierLayout from '@/components/CourierLayout';
import { Icon } from '@rneui/themed';
import { API_ENDPOINTS, handleApiError } from '@/config/api';
import api from '@/lib/api';
import { format } from 'date-fns';

type EarningStats = {
  totalEarnings: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalDeliveries: number;
  averagePerDelivery: number;
};

type EarningHistory = {
  id: string;
  orderId: string;
  customerName: string;
  completedAt: string;
  amount: number;
};

export default function EarningsScreen() {
  const [stats, setStats] = useState<EarningStats | null>(null);
  const [history, setHistory] = useState<EarningHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.COURIER.EARNINGS);
      setStats(response.data.stats);
      setHistory(response.data.history);
      setError(null);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CourierLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      </CourierLayout>
    );
  }

  if (error) {
    return (
      <CourierLayout>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchEarningsData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </CourierLayout>
    );
  }

  return (
    <CourierLayout>
      <View style={styles.container}>
        {/* Stats Cards */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statsCard}>
                <Text style={styles.statsLabel}>Today</Text>
                <Text style={styles.statsAmount}>AED {stats.todayEarnings.toFixed(2)}</Text>
              </View>
              <View style={styles.statsCard}>
                <Text style={styles.statsLabel}>This Week</Text>
                <Text style={styles.statsAmount}>AED {stats.weeklyEarnings.toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statsCard}>
                <Text style={styles.statsLabel}>This Month</Text>
                <Text style={styles.statsAmount}>AED {stats.monthlyEarnings.toFixed(2)}</Text>
              </View>
              <View style={styles.statsCard}>
                <Text style={styles.statsLabel}>Total</Text>
                <Text style={styles.statsAmount}>AED {stats.totalEarnings.toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Deliveries</Text>
                <Text style={styles.summaryValue}>{stats.totalDeliveries}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Average per Delivery</Text>
                <Text style={styles.summaryValue}>AED {stats.averagePerDelivery.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Earnings History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent Earnings</Text>
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.orderId}>Order #{item.orderId}</Text>
                  <Text style={styles.amount}>AED {item.amount.toFixed(2)}</Text>
                </View>
                <View style={styles.historyDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="account" type="material-community" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{item.customerName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="clock" type="material-community" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {format(new Date(item.completedAt), 'MMM d, yyyy h:mm a')}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No earnings history yet</Text>
            }
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </CourierLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: '#065F46',
    marginBottom: 4,
  },
  statsAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#065F46',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  historySection: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
  },
  historyDetails: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
}); 