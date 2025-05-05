import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from 'react-native';
import BusinessLayout from '@/components/BusinessLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import { Icon } from '@rneui/themed';
import { FoodItem } from '@/store/slices/foodItemsSlice';
import {
  setItems,
  setLoading,
  setError,
} from '@/store/slices/inventorySlice';
import api from '@/lib/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Filter = {
  category: string | null;
  inStock: boolean | null;
};

const CATEGORIES = ['MEAT', 'DAIRY', 'PRODUCE', 'BAKERY', 'PREPARED', 'OTHER'];

const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'MEAT':
      return 'Meat';
    case 'DAIRY':
      return 'Dairy';
    case 'PRODUCE':
      return 'Produce';
    case 'BAKERY':
      return 'Bakery';
    case 'PREPARED':
      return 'Prepared';
    case 'OTHER':
      return 'Other';
    default:
      return 'Unknown';
  }
};

export default function InventoryScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { items, loading, error } = useAppSelector((state) => state.inventory);
  const [filters, setFilters] = useState<Filter>({
    category: null,
    inStock: null,
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInventory();

    // Set up periodic refresh every 2 minutes
    const refreshInterval = setInterval(fetchInventory, 120000);

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchInventory = async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await api.get('/business/food-items');
      dispatch(setItems(data));
    } catch (err) {
      dispatch(setError('Failed to fetch inventory items'));
      Alert.alert('Error', 'Failed to fetch inventory items');
    } finally {
      dispatch(setLoading(false));
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchInventory();
  };

  const filteredItems = items.filter(item => {
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    if (filters.inStock !== null) {
      const isInStock = item.quantity > 0;
      if (filters.inStock !== isInStock) {
        return false;
      }
    }
    return true;
  });

  const renderItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigation.navigate('Business', { 
        screen: 'EditItem',
        params: { itemId: item.id }
      })}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.category}>{getCategoryLabel(item.category)}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>AED {item.price.toFixed(2)}</Text>
          <View style={styles.quantityContainer}>
            <View style={[
              styles.stockIndicator,
              { backgroundColor: item.quantity > 0 ? '#22C55E' : '#EF4444' }
            ]} />
            <Text style={styles.quantity}>
              {item.quantity > 0 ? `${item.quantity} in stock` : 'Out of stock'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <BusinessLayout>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Business', { screen: 'AddItem' })}
        >
          <Icon name="add" type="material" color="#fff" size={24} />
          <Text style={styles.addButtonText}>Add New Item</Text>
        </TouchableOpacity>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowCategoryModal(true)}
          >
            <Icon name="category" type="material" size={20} color="#374151" />
            <Text style={styles.filterText}>
              {filters.category ? getCategoryLabel(filters.category) : 'All Categories'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilters(prev => ({ ...prev, inStock: prev.inStock === null ? true : prev.inStock === true ? false : null }))}
          >
            <Icon 
              name={filters.inStock === null ? 'filter-list' : filters.inStock ? 'check-circle' : 'cancel'} 
              type="material" 
              size={20} 
              color="#374151" 
            />
            <Text style={styles.filterText}>
              {filters.inStock === null ? 'All Stock' : filters.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#22C55E" />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchInventory}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.centerContainer}>
            <Icon name="inventory" type="material" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubtext}>
              {items.length === 0 
                ? 'Add your first item to get started'
                : 'Try adjusting your filters'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#22C55E']}
                tintColor="#22C55E"
              />
            }
          />
        )}

        <Modal
          visible={showCategoryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setFilters(prev => ({ ...prev, category: null }));
                  setShowCategoryModal(false);
                }}
              >
                <Text>All Categories</Text>
              </TouchableOpacity>

              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.modalOption}
                  onPress={() => {
                    setFilters(prev => ({ ...prev, category }));
                    setShowCategoryModal(false);
                  }}
                >
                  <Text>{getCategoryLabel(category)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </View>
    </BusinessLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22C55E',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  quantity: {
    fontSize: 14,
    color: '#6B7280',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
});
