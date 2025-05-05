import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import BusinessLayout from '@/components/BusinessLayout';
import { useAppDispatch } from '@/store';
import { Icon } from '@rneui/themed';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '@/lib/api';
import { FoodItem, updateFoodItem } from '@/store/slices/foodItemsSlice';
import { FoodCategory, FoodStatus } from '@food-waste/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { uploadImages } from '@/lib/cloudinary';

export default function EditItemScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState<FoodItem | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState<FoodCategory>(FoodCategory.OTHER);
  const [images, setImages] = useState<string[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [discountThreshold, setDiscountThreshold] = useState('');

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const itemId = (route.params as any)?.itemId;
      if (!itemId) {
        Alert.alert('Error', 'Item ID is required');
        navigation.goBack();
        return;
      }

      const { data } = await api.get(`/business/food-items/${itemId}`);
      setItem(data);
      setName(data.name);
      setDescription(data.description || '');
      setPrice(data.price.toString());
      setOriginalPrice(data.originalPrice.toString());
      setQuantity(data.quantity.toString());
      setExpiryDate(new Date(data.expiryDate));
      setCategory(data.category);
      setImages(data.images || []);
      if (data.discountPercentage) {
        setDiscountPercentage(data.discountPercentage.toString());
      }
      if (data.discountThreshold) {
        setDiscountThreshold(data.discountThreshold.toString());
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch item details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant camera roll permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleSave = async () => {
    if (!item) return;

    try {
      setSaving(true);

      // Validate inputs
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter item name');
        return;
      }

      if (!price.trim() || !originalPrice.trim()) {
        Alert.alert('Error', 'Please enter both current and original prices');
        return;
      }

      if (!quantity.trim()) {
        Alert.alert('Error', 'Please enter quantity');
        return;
      }

      // Separate existing and new images
      const existingImages = images.filter(img => img.startsWith('http'));
      const newImages = images.filter(img => !img.startsWith('http'));
      
      // Upload only new images
      let uploadedImageUrls: string[] = [];
      if (newImages.length > 0) {
        uploadedImageUrls = await uploadImages(newImages);
      }

      // Combine existing and newly uploaded images
      const allImages = [...existingImages, ...uploadedImageUrls];

      const itemPayload = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        originalPrice: parseFloat(originalPrice),
        quantity: parseInt(quantity, 10),
        expiryDate: expiryDate.toISOString(),
        category,
        images: allImages,
        status: item.status,
        discountPercentage: discountPercentage ? parseFloat(discountPercentage) : null,
        discountThreshold: discountThreshold ? parseInt(discountThreshold, 10) : null,
      };

      const { data: updatedItem } = await api.patch(`/business/food-items/${item.id}`, itemPayload);
      dispatch(updateFoodItem(updatedItem));
      Alert.alert('Success', 'Item updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <BusinessLayout showBackButton>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout showBackButton>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Item Details</Text>
            
            <View style={styles.imagesContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Icon name="close" type="material" color="#fff" size={20} />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Icon name="add-a-photo" type="material" size={24} color="#22C55E" />
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

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Current Price (AED)</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Original Price (AED)</Text>
                <TextInput
                  style={styles.input}
                  value={originalPrice}
                  onChangeText={setOriginalPrice}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Expiry Date</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>{expiryDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={expiryDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dynamic Pricing</Text>
            <Text style={styles.description}>
              Set up automatic discounts based on quantity thresholds
            </Text>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Discount Percentage</Text>
                <TextInput
                  style={styles.input}
                  value={discountPercentage}
                  onChangeText={setDiscountPercentage}
                  keyboardType="decimal-pad"
                  placeholder="Enter discount %"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Quantity Threshold</Text>
                <TextInput
                  style={styles.input}
                  value={discountThreshold}
                  onChangeText={setDiscountThreshold}
                  keyboardType="number-pad"
                  placeholder="Enter threshold"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </BusinessLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#22C55E',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 