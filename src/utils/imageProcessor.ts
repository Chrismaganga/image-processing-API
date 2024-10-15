import sharp from 'sharp';
import path from 'path';

export const resizeImage = async (inputPath: string, width: number, height: number): Promise<string> => {
  const outputPath = path.join('processed', `resized_${width}x${height}_${path.basename(inputPath)}`);

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
