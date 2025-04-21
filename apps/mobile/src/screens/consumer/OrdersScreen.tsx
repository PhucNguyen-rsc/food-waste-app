import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ConsumerLayout from '@/components/ConsumerLayout';
import api from '@/lib/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Order } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OrdersScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetailScreen', { order: item })}
    >
      <Image
        source={{ uri: 'https://via.placeholder.com/60' }}
        style={styles.logo}
      />
      <View style={styles.orderContent}>
        <Text style={styles.restaurant}>Order #{item.id}</Text>
        <Text style={styles.itemsText}>{item.items.length} items • {item.totalAmount} AED</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ConsumerLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Your Orders</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#22C55E" />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  orderContent: {
    flex: 1,
  },
  restaurant: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemsText: {
    fontSize: 14,
    color: '#555',
  },
  status: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
  },
  arrow: {
    fontSize: 20,
    color: '#888',
    marginLeft: 8,
  },
});
