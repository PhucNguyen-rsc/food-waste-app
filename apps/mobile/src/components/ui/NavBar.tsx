import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface NavBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function NavBar({ title = 'feedr', showBackButton = false, onBackPress }: NavBarProps) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        {showBackButton && (
          <View style={styles.backButton}>
            {/* We'll add a back button icon here later */}
          </View>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#22C55E',
    height: 40,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
}); 