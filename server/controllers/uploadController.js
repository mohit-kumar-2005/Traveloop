import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ success: false, message: 'No image file' });
    }
    
    // Attempt to upload to Cloudinary first
    try {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const folder = req.body.folder || 'traveloop/uploads';
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataUri, { folder });
        return res.json({ success: true, url: result.secure_url });
      }
    } catch (err) {
      console.warn("Cloudinary upload failed, falling back to local storage:", err.message);
    }
    
    // Fallback to local file system
    const ext = req.file.mimetype.split('/')[1] || 'jpg';
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const uploadPath = path.join(__dirname, '..', 'uploads', filename);
    
    fs.writeFileSync(uploadPath, req.file.buffer);
    
    const url = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    res.json({ success: true, url });
  } catch (err) {
    next(err);
  }
};
