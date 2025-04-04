declare module 'react-native-cloudinary' {
  interface CloudinaryConfig {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  }

  interface UploadOptions {
    upload_preset?: string;
    folder?: string;
    [key: string]: any;
  }

  interface UploadResponse {
    secure_url: string;
    [key: string]: any;
  }

  class Cloudinary {
    static config(config: CloudinaryConfig): void;
    static upload(uri: string, options?: UploadOptions): Promise<UploadResponse>;
  }

  export default Cloudinary;
} 