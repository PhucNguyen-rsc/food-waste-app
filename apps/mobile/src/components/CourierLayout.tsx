import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourierStackParamList } from '@/navigation/types';
import NavBar from './ui/NavBar';

type CourierLayoutNavProp = NativeStackNavigationProp<CourierStackParamList>;

interface CourierLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function CourierLayout({
  children,
  showBackButton,
  onBackPress,
}: CourierLayoutProps) {
  const navigation = useNavigation<CourierLayoutNavProp>();

  return (
    <View style={styles.container}>
    <SafeAreaView style={styles.safeArea}>
        <NavBar 
          title="Feedr"
          showBackButton={showBackButton} 
          onBackPress={onBackPress} 
        />
      </SafeAreaView>
        <View style={styles.content}>
          {children}
        </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
});
