import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  children: string;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ children, style, variant = 'primary', ...props }: ButtonProps) => {
  return (
    <TouchableOpacity 
      style={[styles.button, styles[variant], style]} 
      {...props}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: '#22C55E',
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#22C55E',
  },
}); 