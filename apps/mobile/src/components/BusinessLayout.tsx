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

type BusinessLayoutNavProp = NativeStackNavigationProp<RootStackParamList>;

interface BusinessLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function BusinessLayout({ 
  children, 
  title,
  showBackButton,
  onBackPress 
}: BusinessLayoutProps) {
  const navigation = useNavigation<BusinessLayoutNavProp>();
  const route = useRoute();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <NavBar 
          title={title} 
          showBackButton={showBackButton} 
          onBackPress={onBackPress} 
        />
      </SafeAreaView>
      <View style={styles.content}>
        {children}
      </View>
      <SafeAreaView style={styles.bottomSafeArea}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  safeArea: {
    backgroundColor: '#22C55E',
  },
  bottomSafeArea: {
    backgroundColor: '#fff',
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
    paddingVertical: 12,
    height: 40,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#22C55E',
    fontWeight: '700',
  },
});
