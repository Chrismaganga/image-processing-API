import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const resizeImage = async (filename: string, width: number, height: number): Promise<string> => {
  // Create absolute paths for input and output
  const uploadsDir = path.resolve('uploads');
  const processedDir = path.resolve('processed');
  
  // Ensure directories exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir, { recursive: true });
  }

  const inputPath = path.join(uploadsDir, filename);
  const outputPath = path.join(processedDir, `resized_${width}x${height}_${filename}`);

  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${filename}`);
  }

  try {
    await sharp(inputPath)
      .resize(width, height)
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to resize the image');
  }
};
