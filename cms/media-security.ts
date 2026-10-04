import sharp from 'sharp';
import { APIError, type CollectionBeforeOperationHook } from 'payload';

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
export const validateImage: CollectionBeforeOperationHook = async ({ req, operation, args }) => {
  if (!['create', 'update'].includes(operation) || !req.file) return args;
  const file = req.file;
  if (!imageMimeTypes.includes(file.mimetype) || file.size > MAX_IMAGE_BYTES || file.data.length > MAX_IMAGE_BYTES) throw new APIError('Upload a PNG, JPEG, WebP, AVIF or GIF image up to 4 MB.', 400);
  try {
    // Check decoded content, not the extension or browser-supplied MIME type.
    const metadata = await sharp(file.data, { limitInputPixels: 24_000_000 }).metadata();
    const expected: Record<string, string> = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heif: 'image/avif', avif: 'image/avif', gif: 'image/gif' };
    if (!metadata.format || expected[metadata.format] !== file.mimetype || !metadata.width || !metadata.height || metadata.width * metadata.height * (metadata.pages || 1) > 24_000_000) throw new Error('invalid');
    // Re-encode before storage: remove active/polyglot trailing content and EXIF.
    const data = await sharp(file.data, { limitInputPixels: 24_000_000 }).webp({ quality: 90 }).toBuffer();
    const basename = (file.name.split(/[\\/]/).pop() || 'image').replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0,80) || 'image';
    req.file = { ...file, data, mimetype: 'image/webp', name: basename + '.webp', size: data.length };
  } catch { throw new APIError('This file is not a supported image, or its dimensions are too large.', 400); }
  return args;
};
