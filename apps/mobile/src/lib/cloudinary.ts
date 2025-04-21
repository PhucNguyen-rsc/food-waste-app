import * as FileSystem from 'expo-file-system';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

export const uploadImage = async (uri: string, options = {}) => {
  try {
    // Convert local URI to base64
    const response = await fetch(uri);
    const blob = await response.blob();
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // Create form data
    const formData = new FormData();
    formData.append('file', base64 as string);
    formData.append('upload_preset', 'food_waste_app');
    formData.append('folder', 'food_items');

    // Upload to Cloudinary
    const uploadResponse = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(`Failed to upload image: ${errorData.message || uploadResponse.statusText}`);
    }

    const result = await uploadResponse.json();
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

export const uploadImages = async (images: string[]): Promise<string[]> => {
  try {
    // If no images are provided, return the placeholder image
    if (!images || images.length === 0) {
      return ['https://images-cdn.ubuy.ae/66e369e1b9dd2d0d754d4eab-freshness-french-bakery-bread-loaf-14.jpg'];
    }

    const uploadedUrls: string[] = [];

    for (const imageUri of images) {
      try {
        // Check if the image is already a URL
        if (imageUri.startsWith('http')) {
          uploadedUrls.push(imageUri);
          continue;
        }

        // For local images, upload to Cloudinary
        const url = await uploadImage(imageUri);
        uploadedUrls.push(url);
      } catch (error) {
        console.error('Error uploading image:', error);
        // If upload fails, use placeholder image
        uploadedUrls.push('https://images-cdn.ubuy.ae/66e369e1b9dd2d0d754d4eab-freshness-french-bakery-bread-loaf-14.jpg');
      }
    }

    return uploadedUrls;
  } catch (error) {
    console.error('Error in uploadImages:', error);
    // Return placeholder image if all uploads fail
    return ['https://images-cdn.ubuy.ae/66e369e1b9dd2d0d754d4eab-freshness-french-bakery-bread-loaf-14.jpg'];
  }
}; 