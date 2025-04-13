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
import { RootStackParamList } from '@/navigation/types';
import NavBar from './ui/NavBar';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure Ionicons is installed

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
          <Icon name="cart-outline" size={24} color="#000" />
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
          <Text
            style={[
              styles.navText,
              route.name === 'ConsumerHome' && styles.activeNavText,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text
            style={[
              styles.navText,
              route.name === 'Profile' && styles.activeNavText,
            ]}
          >
            Profile
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
    color: '#22C55E',
    fontWeight: '700',
  },
});
