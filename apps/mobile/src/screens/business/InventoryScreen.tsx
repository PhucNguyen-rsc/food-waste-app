import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import BusinessLayout from '@/components/BusinessLayout';
import { useAppDispatch, useAppSelector } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { FoodItem } from '@/store/slices/foodItemsSlice';
import { FoodCategory, FoodStatus } from '@food-waste/types';
import {
  setItems,
  setLoading,
  setError,
  updateItemQuantity,
  setCategoryFilter,
  setStatusFilter,
} from '@/store/slices/inventorySlice';
import api from '@/lib/api';

const getCategoryLabel = (category: FoodCategory): string => {
  switch (category) {
    case FoodCategory.MEAT:
      return 'Meat';
    case FoodCategory.DAIRY:
      return 'Dairy';
    case FoodCategory.PRODUCE:
      return 'Produce';
    case FoodCategory.BAKERY:
      return 'Bakery';
    case FoodCategory.PREPARED:
      return 'Prepared';
    case FoodCategory.OTHER:
      return 'Other';
    default:
      return 'Unknown';
  }
};

export default function InventoryScreen() {
  const dispatch = useAppDispatch();
  const { items, loading, error, filters } = useAppSelector((state) => state.inventory);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [quantityInput, setQuantityInput] = useState('');
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    fetchInventory();
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
    }
  };

  const handleUpdateQuantity = async () => {
    if (!selectedItem) return;

    const quantity = Number(quantityInput);

    if (isNaN(quantity)) {
      Alert.alert('Error', 'Quantity must be a number');
      return;
    }

    if (!Number.isInteger(quantity)) {
      Alert.alert('Error', 'Quantity must be a whole number');
      return;
    }

    if (quantity < 0) {
      Alert.alert('Error', 'Quantity must be a positive number');
      return;
    }

    if (quantity > 1000) {
      Alert.alert('Error', 'Quantity cannot exceed 1000');
      return;
    }

    try {
      dispatch(setLoading(true));
      await api.patch(`/business/food-items/${selectedItem.id}`, { quantity });
      dispatch(updateItemQuantity({ id: selectedItem.id, quantity }));
      setShowQuantityModal(false);
      Alert.alert('Success', 'Quantity updated successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to update quantity');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const filteredItems = items.filter(item => {
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    if (filters.status && item.status !== filters.status) {
      return false;
    }
    return true;
  });

  const renderItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => {
        setSelectedItem(item);
        setQuantityInput(item.quantity.toString());
        setShowQuantityModal(true);
      }}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.quantity}>Qty: {item.quantity}</Text>
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.category}>{getCategoryLabel(item.category)}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <BusinessLayout title="Inventory" showBackButton>
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={styles.filterText}>
              Category: {filters.category ? getCategoryLabel(filters.category) : 'All'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => dispatch(setStatusFilter(null))}
          >
            <Text style={styles.filterText}>
              Status: {filters.status || 'All'}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#22C55E" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchInventory}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
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
                  dispatch(setCategoryFilter(null));
                  setShowCategoryModal(false);
                }}
              >
                <Text>All Categories</Text>
              </TouchableOpacity>

              {[
                FoodCategory.MEAT,
                FoodCategory.DAIRY,
                FoodCategory.PRODUCE,
                FoodCategory.BAKERY,
                FoodCategory.PREPARED,
                FoodCategory.OTHER,
              ].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.modalOption}
                  onPress={() => {
                    dispatch(setCategoryFilter(category));
                    setShowCategoryModal(false);
                  }}
                >
                  <Text>{getCategoryLabel(category)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        <Modal
          visible={showQuantityModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowQuantityModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Update Quantity for {selectedItem?.name}
              </Text>
              <TextInput
                style={styles.quantityInput}
                keyboardType="numeric"
                value={quantityInput}
                onChangeText={setQuantityInput}
                placeholder="Enter new quantity"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowQuantityModal(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.updateButton]}
                  onPress={handleUpdateQuantity}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
              </View>
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  quantity: {
    fontSize: 14,
    color: '#6B7280',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 14,
    color: '#4B5563',
  },
  status: {
    fontSize: 14,
    color: '#4B5563',
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
  quantityInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  updateButton: {
    backgroundColor: '#22C55E',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
});
