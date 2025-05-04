import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
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
  businessId: string;
};

export default function ProductDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedQuantity, setSelectedQuantity] = useState('1');
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  // Add error handling for missing product
  if (!route.params?.product) {
    Alert.alert(
      'Error',
      'Product information not found',
      [
        {
          text: 'Go Back',
          onPress: () => navigation.goBack(),
        },
      ]
    );
    return null;
  }

  const product = route.params.product as Product;

  const discountPercent =
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    const quantity = parseInt(selectedQuantity, 10);
    
    if (isNaN(quantity) || quantity < 1) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    if (quantity > product.quantity) {
      Alert.alert('Error', `Only ${product.quantity} items available`);
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0] || undefined,
        quantity: quantity,
        maxQuantity: product.quantity,
        businessId: product.businessId
      })
    );
    setShowQuantityModal(false);
    Alert.alert('Success', 'Item added to cart!');
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
            {product.originalPrice > product.price && (
              <>
                <Text style={styles.originalPrice}>AED {product.originalPrice.toFixed(2)}</Text>
                <Text style={styles.discountBadge}>-{discountPercent}%</Text>
              </>
            )}
          </View>

          <Text style={styles.meta}>
            Quantity Available: <Text style={styles.bold}>{product.quantity}</Text>
          </Text>
          <Text style={styles.meta}>
            Best Before: <Text style={styles.bold}>{product.expiryDate?.split('T')[0]}</Text>
          </Text>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => setShowQuantityModal(true)}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>

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
                  style={[styles.modalButton, styles.addButton]}
                  onPress={handleAddToCart}
                >
                  <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  discountedPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22C55E',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#22C55E',
    fontWeight: '600',
  },
  meta: {
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  addButton: {
    backgroundColor: '#22C55E',
  },
});