import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Icon } from '@rneui/themed';

interface QuantitySelectorProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  maxQuantity: number;
  currentQuantity?: number;
}

export default function QuantitySelector({
  visible,
  onClose,
  onConfirm,
  maxQuantity,
  currentQuantity = 1,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(currentQuantity.toString());

  // Reset quantity when modal becomes visible or currentQuantity changes
  useEffect(() => {
    if (visible) {
      setQuantity(currentQuantity.toString());
    }
  }, [visible, currentQuantity]);

  const handleQuantityChange = (newValue: string) => {
    // Allow empty input for better UX
    if (newValue === '') {
      setQuantity('');
      return;
    }

    // Only allow numbers
    if (!/^\d*$/.test(newValue)) {
      return;
    }

    const numValue = parseInt(newValue, 10);
    if (numValue > maxQuantity) {
      setQuantity(maxQuantity.toString());
    } else {
      setQuantity(newValue);
    }
  };

  const handleIncrement = () => {
    const currentValue = parseInt(quantity || '0', 10);
    const newValue = Math.min(maxQuantity, currentValue + 1);
    setQuantity(newValue.toString());
  };

  const handleDecrement = () => {
    const currentValue = parseInt(quantity || '0', 10);
    const newValue = Math.max(1, currentValue - 1);
    setQuantity(newValue.toString());
  };

  const handleConfirm = () => {
    const numQuantity = parseInt(quantity || '0', 10);
    if (isNaN(numQuantity) || numQuantity < 1) {
      setQuantity('1');
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity');
      return;
    }
    if (numQuantity > maxQuantity) {
      setQuantity(maxQuantity.toString());
      Alert.alert('Invalid Quantity', `Maximum available quantity is ${maxQuantity}`);
      return;
    }
    onConfirm(numQuantity);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Quantity</Text>
          <Text style={styles.subtitle}>Available: {maxQuantity}</Text>
          
          <View style={styles.quantityInputContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, parseInt(quantity || '0', 10) <= 1 && styles.disabledButton]}
              onPress={handleDecrement}
              disabled={parseInt(quantity || '0', 10) <= 1}
            >
              <Icon name="remove" type="material" size={24} color={parseInt(quantity || '0', 10) <= 1 ? '#ccc' : '#666'} />
            </TouchableOpacity>
            
            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={handleQuantityChange}
              keyboardType="numeric"
              maxLength={3}
            />
            
            <TouchableOpacity
              style={[styles.quantityButton, parseInt(quantity || '0', 10) >= maxQuantity && styles.disabledButton]}
              onPress={handleIncrement}
              disabled={parseInt(quantity || '0', 10) >= maxQuantity}
            >
              <Icon name="add" type="material" size={24} color={parseInt(quantity || '0', 10) >= maxQuantity ? '#ccc' : '#666'} />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Icon name="check" type="material" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  quantityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#f8f8f8',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 10,
    width: 60,
    textAlign: 'center',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#22C55E',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 