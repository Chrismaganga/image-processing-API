import path from 'path';

// Paths to assets directories
export const fullImagesPath = path.join(__dirname, '../../assets/full');
export const thumbImagesPath = path.join(__dirname, '../../assets/thumb');

// Add more shared constants or reusable configurations here as needed
export const SUPPORTED_FORMATS = ['jpg', 'jpeg']; // Supported image formats

// Example: Centralized file model (optional if you add database models later)
export interface FileModel {
  filename: string;
  width?: number;
  height?: number;
  path: string;
}

