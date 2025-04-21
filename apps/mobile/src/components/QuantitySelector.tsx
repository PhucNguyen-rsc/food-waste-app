import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  currentQuantity = 0,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(currentQuantity.toString());

  const handleConfirm = () => {
    const numQuantity = parseInt(quantity, 10);
    if (isNaN(numQuantity) || numQuantity < 1 || numQuantity > maxQuantity) {
      Alert.alert('Invalid Quantity', `Please enter a quantity between 1 and ${maxQuantity}`);
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
              style={styles.quantityButton}
              onPress={() => {
                const newQuantity = Math.max(1, parseInt(quantity, 10) - 1);
                setQuantity(newQuantity.toString());
              }}
            >
              <Ionicons name="remove" size={24} color="#666" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              maxLength={3}
            />
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => {
                const newQuantity = Math.min(maxQuantity, parseInt(quantity, 10) + 1);
                setQuantity(newQuantity.toString());
              }}
            >
              <Ionicons name="add" size={24} color="#666" />
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
              <Ionicons name="checkmark" size={24} color="#fff" />
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