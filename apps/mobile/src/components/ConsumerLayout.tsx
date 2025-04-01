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

type ConsumerLayoutNavProp = NativeStackNavigationProp<RootStackParamList>;

interface ConsumerLayoutProps {
  children: React.ReactNode;
}

export default function ConsumerLayout({ children }: ConsumerLayoutProps) {
  const navigation = useNavigation<ConsumerLayoutNavProp>();
  const route = useRoute();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{children}</View>
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
          onPress={() => navigation.navigate('Browse')}
        >
          <Text
            style={[
              styles.navText,
              route.name === 'Browse' && styles.activeNavText,
            ]}
          >
            Browse
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
    color: '#22C55E', // or '#007BFF' for blue
    fontWeight: '700',
  },
});
