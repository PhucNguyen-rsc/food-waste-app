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
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/lib/api';
import ConsumerLayout from '@/components/ConsumerLayout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { RootState } from '@/store';

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
  businessId: string;
};

export default function ConsumerHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const foodItems = useSelector((state: RootState) => state.foodItems.items);
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    'All',
    'Meat',
    'Dairy',
    'Produce',
    'Bakery',
    'Prepared',
    'Other',
  ];

  const fetchItems = async () => {
    try {
      const res = await api.get('/items');
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchItems();
  }, []);

  const renderItem = ({ item }: { item: FoodItem }) => {
    const discountPercent = Math.round(
      ((item.originalPrice - item.price) / item.originalPrice) * 100
    );

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Consumer', { screen: 'ProductDetail', params: { product: item } })}
      >
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
          </View>
        </View>
      </TouchableOpacity>
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

        <View style={styles.categoriesWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
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
          </ScrollView>
        </View>

        <View style={styles.contentContainer}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items available at the moment</Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
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
        </View>
      </View>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInput: {
    height: 44,
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  categoriesWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 32,
    justifyContent: 'center',
  },
  categorySelected: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  categoryText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
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
    justifyContent: 'flex-start',
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
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});