import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('☁️ Cloudinary configured successfully.');
} else {
  console.log('📁 Cloudinary not configured or credentials missing. Using local storage fallback for uploads.');
}

/**
 * Uploads a file buffer or path to Cloudinary or falls back to local storage
 */
export const uploadFile = async (file, folder = 'hireflow/resumes') => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'raw',
          public_id: `${Date.now()}_${path.parse(file.originalname).name.replace(/[^a-zA-Z0-9]/g, '_')}`,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error, using local fallback:', error);
            const localResult = saveFileLocally(file);
            return resolve(localResult);
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            storage: 'cloudinary',
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  // Fallback to local storage
  return saveFileLocally(file);
};

export const saveFileLocally = (file) => {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const filePath = path.join(uploadsDir, safeName);

  fs.writeFileSync(filePath, file.buffer);

  const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  return {
    url: `${baseUrl}/uploads/${safeName}`,
    publicId: safeName,
    storage: 'local',
    localPath: filePath,
  };
};

export default cloudinary;
