import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import api from '@/lib/api';
import ConsumerLayout from '@/components/ConsumerLayout';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  quantity: number;
  expiryDate: string;
  images?: string[];
  category: string;
};

type ConsumerHomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function ConsumerHomeScreen({ navigation }: ConsumerHomeScreenProps) {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState('1');
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const dispatch = useDispatch();

  const categories = [
    'All',
    'Meat',
    'Dairy',
    'Produce',
    'Bakery',
    'Prepared',
    'Other',
  ];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/items');
        setItems(res.data);
        setFilteredItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory.toUpperCase();
      return matchesSearch && matchesCategory;
    });
    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, items]);

  const handleAddToCart = (item: FoodItem) => {
    setSelectedItem(item);
    setSelectedQuantity('1');
    setShowQuantityModal(true);
  };

  const handleConfirmAddToCart = () => {
    if (!selectedItem) return;
    
    const quantity = parseInt(selectedQuantity, 10);
    
    if (isNaN(quantity) || quantity < 1) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    if (quantity > selectedItem.quantity) {
      Alert.alert('Error', `Only ${selectedItem.quantity} items available`);
      return;
    }

    dispatch(
      addToCart({
        id: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        imageUrl: selectedItem.images?.[0] || undefined,
        quantity: quantity,
      })
    );
    setShowQuantityModal(false);
    Alert.alert('Success', 'Item added to cart!');
  };

  const renderItem = ({ item }: { item: FoodItem }) => {
    const discountPercent = Math.round(
      ((item.originalPrice - item.price) / item.originalPrice) * 100
    );

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Image
          source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.image}
        />
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.expiry}>Expires {item.expiryDate?.split('T')[0]}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.discountedPrice}>AED {item.price}</Text>
          <Text style={styles.originalPrice}>AED {item.originalPrice}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discountPercent}%</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ConsumerLayout>
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for food items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryButton, selectedCategory === cat && styles.categorySelected]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredItems.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 16, color: '#888' }}>No items available at the moment</Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.grid}
          />
        )}

        <Modal
          visible={showQuantityModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowQuantityModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Quantity</Text>
              <TextInput
                style={styles.quantityInput}
                keyboardType="numeric"
                value={selectedQuantity}
                onChangeText={setSelectedQuantity}
                placeholder="Enter quantity"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowQuantityModal(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalAddButton]}
                  onPress={handleConfirmAddToCart}
                >
                  <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#fff',
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
  },
  categorySelected: {
    backgroundColor: '#22C55E',
  },
  categoryText: {
    color: '#4B5563',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  grid: {
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  expiry: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16A34A',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#aaa',
    textDecorationLine: 'line-through',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#22C55E',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
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
  modalAddButton: {
    backgroundColor: '#22C55E',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
