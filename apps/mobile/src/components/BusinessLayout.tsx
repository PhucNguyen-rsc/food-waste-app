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
import { Icon } from '@rneui/themed';

type BusinessLayoutNavProp = NativeStackNavigationProp<RootStackParamList>;

interface BusinessLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

type BusinessTabName = 'BusinessHome' | 'Analytics' | 'AddItem' | 'ManageOrders' | 'BusinessProfile';

type TabType = {
  name: BusinessTabName;
  label: string;
  icon: string;
  type: 'material' | 'material-community';
};

export default function BusinessLayout({ 
  children, 
  title,
  showBackButton,
  onBackPress 
}: BusinessLayoutProps) {
  const navigation = useNavigation<BusinessLayoutNavProp>();
  const route = useRoute();

  const tabs: TabType[] = [
    {
      name: 'BusinessHome',
      label: 'Home',
      icon: 'home',
      type: 'material',
    },
    {
      name: 'Analytics',
      label: 'Analytics',
      icon: 'analytics',
      type: 'material',
    },
    {
      name: 'AddItem',
      label: 'Add',
      icon: 'add-circle',
      type: 'material',
    },
    {
      name: 'ManageOrders',
      label: 'Orders',
      icon: 'package-variant',
      type: 'material-community',
    },
    {
      name: 'BusinessProfile',
      label: 'Profile',
      icon: 'person',
      type: 'material',
    },
  ];

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
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={styles.navButton}
              onPress={() => navigation.navigate(tab.name)}
            >
              <Icon
                name={tab.icon}
                type={tab.type}
                size={24}
                color={route.name === tab.name ? '#22C55E' : '#666'}
              />
              <Text
                style={[
                  styles.navText,
                  route.name === tab.name && styles.activeNavText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
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
    paddingVertical: 8,
    height: 60,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  activeEmoji: {
    opacity: 1,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#22C55E',
    fontWeight: '700',
  },
});
