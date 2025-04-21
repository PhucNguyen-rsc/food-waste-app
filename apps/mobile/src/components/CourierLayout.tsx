import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import NavBar from './ui/NavBar';
import { Ionicons } from '@expo/vector-icons';

type ConsumerLayoutNavProp = NativeStackNavigationProp<RootStackParamList>;
type ConsumerTabName = 'ConsumerHome' | 'Profile';

interface ConsumerLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function ConsumerLayout({ 
  children, 
  title,
  showBackButton,
  onBackPress 
}: ConsumerLayoutProps) {
  const navigation = useNavigation<ConsumerLayoutNavProp>();
  const route = useRoute();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <NavBar 
          title={title} 
          showBackButton={showBackButton} 
          onBackPress={onBackPress} 
        />
        <TouchableOpacity
          style={styles.cartIcon}
          onPress={() => navigation.navigate('CartScreen')}
        >
          <Ionicons
            name="cart-outline"
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.content}>
          {children}
        </View>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('ConsumerHome')}
        >
          <Ionicons
            name={route.name === 'ConsumerHome' ? 'home' : 'home-outline'}
            size={24}
            color={route.name === 'ConsumerHome' ? '#22C55E' : '#666'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons
            name={route.name === 'Profile' ? 'person' : 'person-outline'}
            size={24}
            color={route.name === 'Profile' ? '#22C55E' : '#666'}
          />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  cartIcon: {
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    paddingVertical: 8,
    height: 60,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
