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

type ConsumerLayoutNavProp = NativeStackNavigationProp<RootStackParamList>;

interface ConsumerLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

type ConsumerTabName = 'ConsumerHome' | 'CartScreen' | 'Profile';

type TabType = {
  name: ConsumerTabName;
  label: string;
  icon: string;
  type: 'material' | 'material-community';
};

export default function ConsumerLayout({ 
  children, 
  title,
  showBackButton,
  onBackPress 
}: ConsumerLayoutProps) {
  const navigation = useNavigation<ConsumerLayoutNavProp>();
  const route = useRoute();

  const tabs: TabType[] = [
    {
      name: 'ConsumerHome',
      label: 'Home',
      icon: 'home',
      type: 'material',
    },
    {
      name: 'CartScreen',
      label: 'Cart',
      icon: 'shopping-cart',
      type: 'material',
    },
    {
      name: 'Profile',
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
              testID={`${tab.name.toLowerCase()}-button`}
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
  navText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginTop: 4,
  },
  activeNavText: {
    color: '#22C55E',
    fontWeight: '700',
  },
});
