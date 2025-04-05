import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';

interface FoodItemCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  expiryDate: string;
  images: string[];
  onPress?: () => void;
}

export default function FoodItemCard({
  name,
  description,
  price,
  originalPrice,
  expiryDate,
  images,
  onPress,
}: FoodItemCardProps) {
  const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: images[0] || 'https://via.placeholder.com/150' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>AED {price.toFixed(2)}</Text>
            <Text style={styles.originalPrice}>AED {originalPrice.toFixed(2)}</Text>
          </View>
          <Text style={styles.expiry}>
            Expires: {format(new Date(expiryDate), 'MMM dd, yyyy')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 120,
  },
  image: {
    width: 120,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  footer: {
    marginTop: 'auto',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#22C55E',
  },
  originalPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  discountBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  expiry: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
}); 