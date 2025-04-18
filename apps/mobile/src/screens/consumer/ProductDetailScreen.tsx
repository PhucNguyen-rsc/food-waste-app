import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import ConsumerLayout from '@/components/ConsumerLayout';

type Product = {
  id: string;
  name: string;
  images?: string[];
  description: string;
  price: number;
  originalPrice: number;
  quantity: number;
  expiryDate: string;
};

export default function ProductDetailScreen() {
  const route = useRoute<any>();
  const { product } = route.params;
  const dispatch = useDispatch();

  const discountPercent =
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
        dispatch(
          addToCart({
            id: product.id,
            name: product.name,
            price: product.price, // fixed here
            imageUrl: product.images?.[0] || null,
            quantity: 1,
          })
        );
      };

  return (
    <ConsumerLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{
            uri: product.images?.[0] || 'https://via.placeholder.com/400x300.png?text=No+Image',
          }}
          style={styles.image}
        />

        <View style={styles.content}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.discountedPrice}>AED {product.price.toFixed(2)}</Text>
            <Text style={styles.originalPrice}>AED {product.originalPrice.toFixed(2)}</Text>
            <Text style={styles.discountBadge}>-{discountPercent}%</Text>
          </View>

          <Text style={styles.meta}>
            Quantity Available: <Text style={styles.bold}>{product.quantity}</Text>
          </Text>
          <Text style={styles.meta}>
            Best Before: <Text style={styles.bold}>{product.expiryDate?.split('T')[0]}</Text>
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    height: 280,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountedPrice: {
    fontSize: 22,
    color: '#16A34A',
    fontWeight: 'bold',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#aaa',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    fontSize: 14,
    color: '#22C55E',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  meta: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  bold: {
    fontWeight: '600',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
