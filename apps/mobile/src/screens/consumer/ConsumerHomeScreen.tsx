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
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import api from '@/lib/api';
import ConsumerLayout from '@/components/ConsumerLayout';

export default function ConsumerHomeScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  const handleAddToCart = (item) => {
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.images?.[0] || null,
        quantity: 1,
      })
    );
  };

  const renderItem = ({ item }) => {
    const discountPercent = Math.round(
      ((item.originalPrice - item.price) / item.originalPrice) * 100
    );

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetailScreen', { product: item })}
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

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.grid}
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
});
