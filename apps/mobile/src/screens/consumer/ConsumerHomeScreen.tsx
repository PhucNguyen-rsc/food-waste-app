import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import ConsumerLayout from '../../components/ConsumerLayout';

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 48) / 2; // 16px padding * 3

export type ItemData = {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  bestBefore: string;
  description: string;
  imageUrl?: string;
};

export default function ConsumerHomeScreen() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://10.228.243.83:3000/items');
        setItems(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const renderItem = ({ item }: { item: ItemData }) => {
    const discountPercent = Math.round(
      ((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100
    );

    return (
      <View style={styles.card}>
        <Image
          source={{
            uri:
              item.imageUrl ||
              'https://via.placeholder.com/150?text=No+Image',
          }}
          style={styles.image}
        />
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.expiry}>
          Expires {item.bestBefore.toLowerCase().includes('today') ? 'today' : `on ${item.bestBefore}`}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.discountedPrice}>AED {item.discountedPrice}</Text>
          <Text style={styles.originalPrice}>AED {item.originalPrice}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discountPercent}%</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ConsumerLayout>
      <View style={styles.container}>
        <Text style={styles.heading}>Available Items</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#22C55E" />
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.grid}
          />
        )}
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
  heading: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  grid: {
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: itemWidth,
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
