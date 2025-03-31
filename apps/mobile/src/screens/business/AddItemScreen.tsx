import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import BusinessLayout from '../../components/BusinessLayout';

export default function AddItemScreen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [bestBefore, setBestBefore] = useState('');
  const [description, setDescription] = useState('');

  const handleChoosePhoto = () => {
    Alert.alert(
      'Image Upload',
      'For now, paste an image URL manually into the field below.'
    );
  };

  const handleAddItem = async () => {
    if (!itemName.trim()) {
      Alert.alert('Validation', 'Please enter the item name.');
      return;
    }

    const itemPayload = {
      name: itemName.trim(),
      category: category.trim() || 'Misc',
      originalPrice: parseFloat(originalPrice || '0'),
      discountedPrice: parseFloat(discountedPrice || '0'),
      quantity: parseInt(quantity || '0', 10),
      bestBefore,
      description,
      imageUrl: imageUrl.trim() || undefined,
    };

    console.log('📤 Submitting item to backend:', itemPayload);

    try {
      const response = await axios.post('http://10.228.243.83:3000/items', itemPayload);
      console.log('✅ Item successfully added. Response:', response.data);

      Alert.alert('Success', 'Item added successfully!');
      setPhotoUri(null);
      setImageUrl('');
      setItemName('');
      setCategory('');
      setOriginalPrice('');
      setDiscountedPrice('');
      setQuantity('');
      setBestBefore('');
      setDescription('');
    } catch (err: any) {
      console.error('❌ Network or backend error:', err?.message || err);
      if (err?.response) {
        console.error('🔁 Backend responded with:', err.response.data);
      }
      Alert.alert('Error', 'Failed to add item. Please try again.');
    }
  };

  return (
    <BusinessLayout>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.heading}>Add New Item</Text>

            <View style={styles.photoContainer}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.photoPreview} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoPlaceholderText}>Upload food photo</Text>
                </View>
              )}
              <TouchableOpacity style={styles.choosePhotoBtn} onPress={handleChoosePhoto}>
                <Text style={styles.choosePhotoText}>Choose Photo</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Image URL (paste link)"
              value={imageUrl}
              onChangeText={setImageUrl}
            />
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={itemName}
              onChangeText={setItemName}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
            />
            <TextInput
              style={styles.input}
              placeholder="Original Price"
              keyboardType="numeric"
              value={originalPrice}
              onChangeText={setOriginalPrice}
            />
            <TextInput
              style={styles.input}
              placeholder="Discounted Price"
              keyboardType="numeric"
              value={discountedPrice}
              onChangeText={setDiscountedPrice}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity Available"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
            <TextInput
              style={styles.input}
              placeholder="Best Before (YYYY-MM-DD)"
              value={bestBefore}
              onChangeText={setBestBefore}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddItem}>
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </BusinessLayout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 120,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  photoPlaceholderText: {
    color: '#999',
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  choosePhotoBtn: {
    marginTop: 8,
  },
  choosePhotoText: {
    color: '#007AFF',
    fontSize: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
