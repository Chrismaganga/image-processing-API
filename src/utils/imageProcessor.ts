
import path from 'path';
import sharp from 'sharp';

export const resizeImage = async (filename: string, width: number, height: number): Promise<string> => {
  const inputPath = path.join(__dirname, '../../images', 'images', filename); 
  const outputPath = path.join(__dirname, '../../', 'images', `resized-${filename}-${width}x${height}.jpg`);

  try {
    await sharp(inputPath)
      .resize(width, height)
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error;
  }
};
