import { v2 as cloudinary } from "cloudinary";
import env from "../config/env.js";

class CloudinaryService {
  static instance;

  constructor() {
    if (!CloudinaryService.instance) {
      cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
        secure: true,
      });
      CloudinaryService.instance = this;
    }
    return CloudinaryService.instance;
  }

  async upload(file, { folder = "" }) {
    try {
      const result = await cloudinary.uploader.upload(file, {
        allowed_formats: ["jpg", "jpeg", "png"],
        folder: folder,
        use_filename: true,
        unique_filename: true,
        exif: true,
      });
      return result;
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  async getInfo(publicId) {
    try {
      const options = {
        exif: false,
      };
      const result = await cloudinary.api.resource(publicId, options);
      return result;
    } catch (error) {
      throw new Error(`Cloudinary getInfo failed: ${error}`);
    }
  }
}

const instance = new CloudinaryService();
Object.freeze(instance);

export default instance;
