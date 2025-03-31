import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type BusinessLayoutNavProp = NativeStackNavigationProp<RootStackParamList>;

interface BusinessLayoutProps {
  children: React.ReactNode;
}

export default function BusinessLayout({ children }: BusinessLayoutProps) {
  const navigation = useNavigation<BusinessLayoutNavProp>();
  const route = useRoute();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{children}</View>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('BusinessHome')}
        >
          <Text
            style={[
              styles.navText,
              route.name === 'BusinessHome' && styles.activeNavText,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('AddItem')}
        >
          <Text
            style={[
              styles.navText,
              route.name === 'AddItem' && styles.activeNavText,
            ]}
          >
            Add Item
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('ManageOrders')}
        >
          <Text
            style={[
              styles.navText,
              route.name === 'ManageOrders' && styles.activeNavText,
            ]}
          >
            Orders
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  activeNavText: {
    color: '#22C55E', // Change to '#007BFF' if you prefer blue
    fontWeight: '700',
  },
});
