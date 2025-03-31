// src/screens/business/BusinessHomeScreen.tsx

import React, { useState, useEffect } from 'react';
import { 
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import BusinessLayout from '../../components/BusinessLayout'; // Use your BusinessLayout for a bottom bar

/** Types for dummy data */
type Listing = {
  id: string;
  name: string;
  quantityLeft: number;
  expiresIn: string;      // e.g. "Expires today" or "Expires in 2d"
  price: number;
  pricingType: 'Dynamic' | 'Fixed';
  imageUrl?: string;
};

type Order = {
  id: string;
  items: string;          // e.g. "2x Veggie Sandwich, 1x Salad"
  totalPrice: number;
  status: 'Delivered' | 'In Progress' | 'Pending';
};

export default function BusinessHomeScreen() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch from your backend.
    // For now, we mock data:
    setListings([
      {
        id: 'list1',
        name: 'Veggie Sandwich',
        quantityLeft: 12,
        expiresIn: 'Expires today',
        price: 15,
        pricingType: 'Dynamic',
        imageUrl: 'https://placehold.co/100x100',
      },
      {
        id: 'list2',
        name: 'Fruit Salad Bowl',
        quantityLeft: 8,
        expiresIn: 'Expires in 2d',
        price: 12,
        pricingType: 'Fixed',
      },
    ]);

    setOrders([
      {
        id: 'ORD2841',
        items: '2x Veggie Sandwich\n1x Fruit Salad Bowl',
        totalPrice: 42,
        status: 'Delivered',
      },
      {
        id: 'ORD2840',
        items: '3x Fruit Salad Bowl',
        totalPrice: 36,
        status: 'In Progress',
      },
    ]);
  }, []);

  // Render each listing as shown in the screenshot
  const renderListing = (listing: Listing) => (
    <View key={listing.id} style={styles.listingCard}>
      {listing.imageUrl && (
        <Image source={{ uri: listing.imageUrl }} style={styles.listingImage} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.listingName}>{listing.name}</Text>
        <Text style={styles.listingMeta}>
          {listing.quantityLeft} left • {listing.expiresIn}
        </Text>
        <Text style={styles.listingPrice}>AED {listing.price}</Text>
        <Text style={styles.listingPriceType}>
          {listing.pricingType === 'Dynamic'
            ? 'Dynamic pricing active'
            : 'Fixed price'}
        </Text>
      </View>
    </View>
  );

  // Render each order
  const renderOrder = (order: Order) => {
    let statusStyle = styles.statusDefault;
    if (order.status === 'Delivered') statusStyle = styles.statusDelivered;
    if (order.status === 'In Progress') statusStyle = styles.statusInProgress;

    return (
      <View key={order.id} style={styles.orderCard}>
        <Text style={styles.orderId}>#{order.id}</Text>
        <Text style={styles.orderItems}>{order.items}</Text>
        <Text style={styles.orderPrice}>AED {order.totalPrice}</Text>

        <View style={[styles.statusContainer, statusStyle]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
    );
  };

  return (
    <BusinessLayout>
      <ScrollView style={{ flex: 1 }}>
        {/* TOP BAR: Avatar, store name, "Online", notification icons */}
        <View style={styles.topBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{ uri: 'https://placehold.co/40x40' }}
              style={styles.avatar}
            />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.storeName}>Alex's Kitchen</Text>
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>

          {/* Right side icons (notifications, settings, etc.) */}
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{ fontSize: 18 }}>⚙</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TWO INFO CARDS: "Today's Sales" and "Active Orders" */}
        <View style={styles.infoRow}>
          {/* Card 1: Today's Sales */}
          <View style={[styles.infoCard, { marginRight: 8 }]}>
            <Text style={styles.infoLabel}>Today's Sales</Text>
            <Text style={styles.infoValue}>AED 458</Text>
            <Text style={styles.infoSub}>↑12% from yesterday</Text>
          </View>

          {/* Card 2: Active Orders */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Active Orders</Text>
            <Text style={styles.infoValue}>7</Text>
            <Text style={styles.infoSub}>2 need attention</Text>
          </View>
        </View>

        {/* QUICK ACTIONS ROW */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Navigate to Add Item screen from Quick Actions too
              // (This should match the behavior of the bottom bar "Add Item" button)
              // For example, if using navigation: navigation.navigate('AddItem')
              console.log('Quick Action: Add Item');
            }}
          >
            <Text>Add Item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.log('Quick Action: Update Price')}
          >
            <Text>Update Price</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.log('Quick Action: Inventory')}
          >
            <Text>Inventory</Text>
          </TouchableOpacity>
        </View>

        {/* ACTIVE LISTINGS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Listings</Text>
          <TouchableOpacity onPress={() => console.log('See All Listings')}>
            <Text style={styles.linkText}>See All</Text>
          </TouchableOpacity>
        </View>
        {listings.map(renderListing)}

        {/* RECENT ORDERS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => console.log('View All Orders')}>
            <Text style={styles.linkText}>View All</Text>
          </TouchableOpacity>
        </View>
        {orders.map(renderOrder)}
      </ScrollView>
    </BusinessLayout>
  );
}

const styles = StyleSheet.create({
  /* TOP BAR */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40, 
    height: 40, 
    borderRadius: 20,
  },
  storeName: {
    fontSize: 16, 
    fontWeight: '600',
  },
  onlineText: {
    fontSize: 12,
    color: 'green',
  },

  /* INFO ROW */
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  infoSub: {
    fontSize: 12,
    color: 'green',
    marginTop: 4,
  },

  /* QUICK ACTIONS */
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#EEE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },

  /* SECTION HEADER */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
  },

  /* LISTINGS */
  listingCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listingImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  listingName: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  listingMeta: {
    fontSize: 12,
    color: '#666',
  },
  listingPrice: {
    color: '#22C55E',
    fontSize: 14,
    marginTop: 4,
  },
  listingPriceType: {
    fontSize: 12,
    color: '#333',
  },

  /* ORDERS */
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  orderId: {
    fontWeight: '600',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 13,
    marginBottom: 4,
    color: '#333',
  },
  orderPrice: {
    fontSize: 14,
    color: '#000',
  },
  statusContainer: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusDefault: {
    backgroundColor: '#EEE',
  },
  statusDelivered: {
    backgroundColor: '#D1FADF',
  },
  statusInProgress: {
    backgroundColor: '#E0E7FF',
  },
});
