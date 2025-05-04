const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

export const uploadImage = async (uri: string, options = {}) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
    formData.append('upload_preset', 'food_waste_app');
    formData.append('folder', 'food_items');

    // Upload to Cloudinary
    const uploadResponse = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error('Cloudinary upload error:', errorData);
      throw new Error('Failed to upload image');
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