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
      throw new Error('Failed to upload image');
    }

    const result = await uploadResponse.json();
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

export const uploadImages = async (uris: string[]) => {
  try {
    const uploadedUrls: string[] = [];
    
    for (const uri of uris) {
      const url = await uploadImage(uri);
      uploadedUrls.push(url);
    }
    
    return uploadedUrls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw new Error('Failed to upload images');
  }
}; 