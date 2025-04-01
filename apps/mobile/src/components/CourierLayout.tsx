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
import Ionicons from '@expo/vector-icons/Ionicons';

type CourierLayoutNavProp = NativeStackNavigationProp<RootStackParamList>;
type IconName = keyof typeof Ionicons.glyphMap;

interface CourierLayoutProps {
  children: React.ReactNode;
}

export default function CourierLayout({ children }: CourierLayoutProps) {
  const navigation = useNavigation<CourierLayoutNavProp>();
  const route = useRoute();
  const currentRoute = route.name;

  const tabs: Array<{
    routeName: keyof RootStackParamList;
    label: string;
    icon: IconName;
    iconActive: IconName;
  }> = [
    {
      routeName: 'CourierHome',
      label: 'Home',
      icon: 'home-outline',
      iconActive: 'home',
    },
    {
      routeName: 'Deliveries',
      label: 'Deliveries',
      icon: 'bicycle-outline',
      iconActive: 'bicycle',
    },
    {
      routeName: 'CourierProfile',
      label: 'Profile',
      icon: 'person-outline',
      iconActive: 'person',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{children}</View>
      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const isActive = currentRoute === tab.routeName;
          return (
            <TouchableOpacity
              key={tab.routeName}
              style={styles.navButton}
              onPress={() => navigation.navigate(tab.routeName as never)}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <Ionicons
                  name={isActive ? tab.iconActive : tab.icon}
                  size={24}
                  color={isActive ? '#22C55E' : '#666'} // Use '#007AFF' for blue
                />
              </View>
              <Text style={[styles.navText, isActive && styles.activeNavText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  iconContainerActive: {
    borderColor: '#22C55E',
    backgroundColor: 'rgba(34, 197, 94, 0.2)', // Use blue rgba if desired
  },
  navText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  activeNavText: {
    color: '#22C55E', // or '#007AFF' for blue
    fontWeight: '700',
  },
});
