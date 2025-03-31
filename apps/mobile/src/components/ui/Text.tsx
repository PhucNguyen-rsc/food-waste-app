import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'body' | 'title' | 'subtitle';
}

export const Text = ({ variant = 'body', style, ...props }: TextProps) => {
  return (
    <RNText
      style={[styles[variant], style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  body: {
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
}); 