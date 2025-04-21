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
  FlatList,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import api from '@/lib/api';
import { uploadImages } from '@/lib/cloudinary';
import BusinessLayout from '@/components/BusinessLayout';
import { FoodCategory, FoodStatus } from '@food-waste/types';

const PLACEHOLDER_IMAGE = 'https://www.allrecipes.com/thmb/CjzJwg2pACUzGODdxJL1BJDRx9Y=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/6788-amish-white-bread-DDMFS-4x3-6faa1e552bdb4f6eabdd7791e59b3c84.jpg';

export default function AddItemScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState<FoodCategory>(FoodCategory.OTHER);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant camera roll permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImage = result.assets[0].uri;
        setImages([...images, newImage]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const formatDateForAPI = (date: Date) => {
    return date.toISOString();
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getCategoryLabel = (category: FoodCategory) => {
    switch (category) {
      case FoodCategory.MEAT:
        return 'Meat';
      case FoodCategory.DAIRY:
        return 'Dairy';
      case FoodCategory.PRODUCE:
        return 'Produce';
      case FoodCategory.BAKERY:
        return 'Bakery';
      case FoodCategory.PREPARED:
        return 'Prepared';
      case FoodCategory.OTHER:
        return 'Other';
      default:
        return 'Other';
    }
  };

  const handleAddItem = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter the item name.');
      return;
    }

    if (!price.trim() || !originalPrice.trim()) {
      Alert.alert('Validation', 'Please enter both current and original prices.');
      return;
    }

    if (!quantity.trim()) {
      Alert.alert('Validation', 'Please enter the quantity available.');
      return;
    }

    try {
      setUploading(true);

      const imagesToUpload = images.length === 0 ? [PLACEHOLDER_IMAGE] : images;

      const uploadedImageUrls = await uploadImages(imagesToUpload);

      const itemPayload = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        originalPrice: parseFloat(originalPrice),
        quantity: parseInt(quantity, 10),
        expiryDate: expiryDate.toISOString(),  // full ISO format
        category,
        images: uploadedImageUrls,
        status: FoodStatus.AVAILABLE,
      };

      const response = await api.post('/business/food-items', itemPayload);

      Alert.alert('Success', 'Food item added successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setOriginalPrice('');
      setQuantity('');
      setExpiryDate(new Date());
      setShowDatePicker(false);
      setCategory(FoodCategory.OTHER);
      setImages([]);
    } catch (err: any) {
      console.error('❌ Network or backend error:', err?.message || err);
      if (err?.response) {
        console.error('🔁 Backend responded with:', err.response.data);
      }
      Alert.alert('Error', 'Failed to add food item. Please try again.');
    } finally {
      setUploading(false);
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
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.heading}>Add New Food Item</Text>

            <View style={styles.imagesContainer}>
              <FlatList
                horizontal
                data={images.length === 0 ? [PLACEHOLDER_IMAGE] : images}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.imageItem}>
                    <Image source={{ uri: item }} style={styles.imagePreview} />
                    {images.length !== 0 && (
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Text style={styles.removeImageText}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Text style={styles.addImageText}>Add Image</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Current Price"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
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
              placeholder="Quantity Available"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />

            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formatDateForDisplay(expiryDate)}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={expiryDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            <TouchableOpacity 
              style={styles.categoryInput}
              onPress={() => setShowCategoryPicker(true)}
            >
              <Text style={styles.categoryText}>
                {getCategoryLabel(category)}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={showCategoryPicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowCategoryPicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select Category</Text>
                  {Object.values(FoodCategory).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        category === cat && styles.selectedCategoryOption
                      ]}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        category === cat && styles.selectedCategoryOptionText
                      ]}>
                        {getCategoryLabel(cat)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setShowCategoryPicker(false)}
                  >
                    <Text style={styles.modalCloseButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <TouchableOpacity 
              style={[styles.button, uploading && styles.buttonDisabled]} 
              onPress={handleAddItem}
              disabled={uploading}
            >
              <Text style={styles.buttonText}>
                {uploading ? 'Uploading...' : 'Add Food Item'}
              </Text>
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
  imagesContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  imageItem: {
    marginRight: 8,
    position: 'relative',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addImageButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignSelf: 'center',
  },
  addImageText: {
    color: 'white',
    fontWeight: '600',
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
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  dateInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    justifyContent: 'center',
    height: 50,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  categoryInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    justifyContent: 'center',
    height: 50,
  },
  categoryText: {
    fontSize: 16,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedCategoryOption: {
    backgroundColor: '#22C55E',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#000',
  },
  selectedCategoryOptionText: {
    color: '#fff',
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalCloseButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
