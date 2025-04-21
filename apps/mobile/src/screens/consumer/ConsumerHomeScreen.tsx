import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import api from '@/lib/api';
import ConsumerLayout from '@/components/ConsumerLayout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { FoodItem } from '@/types';
import { RootState } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import QuantitySelector from '@/components/QuantitySelector';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ConsumerHomeScreen() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const foodItems = useSelector((state: RootState) => state.foodItems.items);

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
    const filtered = items.filter((item: FoodItem) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory.toUpperCase();
      return matchesSearch && matchesCategory;
    });
    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, items]);

  const handleAddToCart = (quantity: number) => {
    if (selectedItem) {
      dispatch(addToCart({
        id: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        imageUrl: selectedItem.images[0],
        quantity: quantity,
        maxQuantity: selectedItem.quantity,
        businessId: selectedItem.businessId
      }));
      setShowQuantitySelector(false);
      setSelectedItem(null);
    }
  };

  const renderItem = ({ item }: { item: FoodItem }) => {
    const discountPercent = Math.round(
      ((item.originalPrice - item.price) / item.originalPrice) * 100
    );

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.image}
        />
        <View style={styles.cardContent}>
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
              onPress={() => {
                setSelectedItem(item);
                setShowQuantitySelector(true);
              }}
            >
              <Ionicons name="add-circle" size={32} color="#22C55E" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ConsumerLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for food items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

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

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.grid}
        />

        <QuantitySelector
          visible={showQuantitySelector}
          onClose={() => {
            setShowQuantitySelector(false);
            setSelectedItem(null);
          }}
          onConfirm={handleAddToCart}
          maxQuantity={selectedItem?.quantity || 0}
          currentQuantity={1}
        />
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
  header: {
    padding: 16,
  },
  searchInput: {
    height: 44,
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
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
  cardContent: {
    flex: 1,
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
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
