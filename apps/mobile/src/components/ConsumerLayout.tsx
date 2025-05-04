import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
} from 'react-native';
import NavBar from './ui/NavBar';

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
  onBackPress,
}: ConsumerLayoutProps) {
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
