import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Searchbar, Menu, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { CourierAPI } from '@/lib/courier-api';
import { useAppSelector } from '@/store';
import { format } from 'date-fns';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Adjust the Delivery type to match the actual API response structure
type Delivery = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  // Add any other fields that come directly from the API response
  
  // These are derived fields that we'll calculate from the API response
  orderId?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  customerName?: string;
  estimatedDeliveryTime?: string;
  items?: { name: string; quantity: number }[];
  
  // Include possible nested objects from the API
  consumer?: {
    id: string;
    name: string | null;
    deliveryAddress: string | null;
    // Add other consumer fields as needed
  };
  business?: {
    id: string;
    name: string | null;
    address: string | null;
    // Add other business fields as needed
  };
  order?: {
    id: string;
    // Add other order fields as needed
  };
};

const DeliveryHistoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAppSelector(state => state.auth.user);
  
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchDeliveryHistory = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Make sure we have a user ID before fetching
      if (!user?.id) {
        setError('User not found. Please sign in again.');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const apiResponse = await CourierAPI.getDeliveryHistory(user.id);
      
      // Process the API response to ensure it matches our Delivery type
      const processedDeliveries: Delivery[] = apiResponse.map((delivery: any) => {
        return {
          ...delivery,
          // Derive orderId from the nested order object if available
          orderId: delivery.order?.id || 'Unknown',
          // Derive addresses from nested objects
          pickupAddress: delivery.business?.address || 'Unknown pickup location',
          deliveryAddress: delivery.consumer?.deliveryAddress || 'Unknown delivery location',
          // Derive customer name
          customerName: delivery.consumer?.name || 'Unknown customer',
        };
      });
      
      setDeliveries(processedDeliveries);
      applyFilters(processedDeliveries, searchQuery, statusFilter);
    } catch (error) {
      console.error('Error fetching delivery history:', error);
      setError('Failed to load delivery history. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeliveryHistory();
  }, []);

  const applyFilters = (
    deliveryData: Delivery[], 
    query: string, 
    status: string | null
  ) => {
    let filtered = deliveryData;
    
    // Apply status filter
    if (status) {
      filtered = filtered.filter(delivery => 
        delivery.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Apply search query
    if (query) {
      filtered = filtered.filter(delivery => 
        delivery.orderId?.toLowerCase().includes(query.toLowerCase()) ||
        delivery.customerName?.toLowerCase().includes(query.toLowerCase()) ||
        delivery.pickupAddress?.toLowerCase().includes(query.toLowerCase()) ||
        delivery.deliveryAddress?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredDeliveries(filtered);
  };

  const onRefresh = () => {
    fetchDeliveryHistory(true);
  };

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(deliveries, query, statusFilter);
  };

  const handleFilterSelect = (status: string | null) => {
    setStatusFilter(status);
    applyFilters(deliveries, searchQuery, status);
    setFilterMenuVisible(false);
  };

  const handleViewDelivery = (deliveryId: string) => {
    navigation.navigate('DeliveryDetails', { deliveryId });
  };

  // Format the status for display
  const formatStatus = (status: string): string => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get status chip color
  const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return '#f59e0b'; // Amber
      case 'ACCEPTED':
        return '#3b82f6'; // Blue
      case 'PICKED_UP':
        return '#8b5cf6'; // Purple
      case 'DELIVERED':
        return '#10b981'; // Green
      case 'CANCELLED':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Loading your delivery history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={() => fetchDeliveryHistory()} 
          style={styles.retryButton}
        >
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search deliveries"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <Button 
              mode="outlined" 
              onPress={() => setFilterMenuVisible(true)}
              style={styles.filterButton}
            >
              {statusFilter ? `Filter: ${formatStatus(statusFilter)}` : 'Filter'}
            </Button>
          }
        >
          <Menu.Item 
            onPress={() => handleFilterSelect(null)} 
            title="All Deliveries" 
          />
          <Divider />
          <Menu.Item 
            onPress={() => handleFilterSelect('PENDING')} 
            title="Pending" 
          />
          <Menu.Item 
            onPress={() => handleFilterSelect('ACCEPTED')} 
            title="Accepted" 
          />
          <Menu.Item 
            onPress={() => handleFilterSelect('PICKED_UP')} 
            title="Picked Up" 
          />
          <Menu.Item 
            onPress={() => handleFilterSelect('DELIVERED')} 
            title="Delivered" 
          />
          <Menu.Item 
            onPress={() => handleFilterSelect('CANCELLED')} 
            title="Cancelled" 
          />
        </Menu>
      </View>

      <FlatList
        data={filteredDeliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => handleViewDelivery(item.id)}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.orderTitle}>Order #{item.orderId}</Title>
                <Chip 
                  style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
                  textStyle={styles.statusChipText}
                >
                  {formatStatus(item.status)}
                </Chip>
              </View>
              
              <Paragraph style={styles.dateText}>
                {formatDate(item.createdAt)}
              </Paragraph>
              
              <View style={styles.addressContainer}>
                <View style={styles.addressItem}>
                  <Text style={styles.addressLabel}>From:</Text>
                  <Text style={styles.addressText} numberOfLines={1}>{item.pickupAddress}</Text>
                </View>
                <View style={styles.addressItem}>
                  <Text style={styles.addressLabel}>To:</Text>
                  <Text style={styles.addressText} numberOfLines={1}>{item.deliveryAddress}</Text>
                </View>
              </View>

              <View style={styles.customerContainer}>
                <Text style={styles.customerLabel}>Customer:</Text>
                <Text style={styles.customerName}>{item.customerName}</Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => handleViewDelivery(item.id)}
                style={styles.viewButton}
              >
                View Details
              </Button>
            </Card.Actions>
          </Card>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22c55e']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || statusFilter 
                ? 'No deliveries match your filters' 
                : 'No delivery history found'}
            </Text>
            {(searchQuery || statusFilter) && (
              <Button 
                mode="outlined" 
                onPress={() => {
                  setSearchQuery('');
                  setStatusFilter(null);
                  setFilteredDeliveries(deliveries);
                }}
                style={styles.clearButton}
              >
                Clear Filters
              </Button>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#22c55e',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
  },
  searchbar: {
    flex: 1,
    marginRight: 8,
    elevation: 2,
  },
  filterButton: {
    justifyContent: 'center',
    borderColor: '#22c55e',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusChip: {
    height: 28,
  },
  statusChipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  addressContainer: {
    marginBottom: 12,
  },
  addressItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '500',
    width: 50,
  },
  addressText: {
    fontSize: 14,
    flex: 1,
  },
  customerContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  customerLabel: {
    fontSize: 14,
    fontWeight: '500',
    width: 80,
  },
  customerName: {
    fontSize: 14,
  },
  viewButton: {
    borderColor: '#22c55e',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearButton: {
    borderColor: '#22c55e',
  },
});

export default DeliveryHistoryScreen; 