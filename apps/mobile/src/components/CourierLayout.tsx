import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourierStackParamList } from '@/navigation/types';
import NavBar from './ui/NavBar';
import { Icon } from '@rneui/themed';

type CourierLayoutNavProp = NativeStackNavigationProp<CourierStackParamList>;

export default function CourierLayout({
  children,
  title,
  showBackButton,
  onBackPress,
}: {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}) {
  const navigation = useNavigation<CourierLayoutNavProp>();
  const route = useRoute();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerRow}>
        <NavBar 
          title={title} 
          showBackButton={showBackButton} 
          onBackPress={onBackPress} 
        />
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        <View style={styles.content}>
          {children}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('CourierHome')}
        >
          <Icon
            name={route.name === 'CourierHome' ? 'home' : 'home-outline'}
            type="material-community"
            size={24}
            color={route.name === 'CourierHome' ? '#22C55E' : '#666'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('History')}
        >
          <Icon
            name={route.name === 'History' ? 'clock' : 'clock-outline'}
            type="material-community"
            size={24}
            color={route.name === 'History' ? '#22C55E' : '#666'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Earnings')}
        >
          <Icon
            name={route.name === 'Earnings' ? 'wallet' : 'wallet-outline'}
            type="material-community"
            size={24}
            color={route.name === 'Earnings' ? '#22C55E' : '#666'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('CourierProfile')}
        >
          <Icon
            name={route.name === 'CourierProfile' ? 'account' : 'account-outline'}
            type="material-community"
            size={24}
            color={route.name === 'CourierProfile' ? '#22C55E' : '#666'}
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
