import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const fullImagesPath = path.join(__dirname, '../../assets/full');
const thumbImagesPath = path.join(__dirname, '../../assets/thumb');

export const processImage = async (filename: string, width: number, height: number): Promise<string> => {
  const inputPath = path.join(fullImagesPath, `${filename}.jpg`);
  const outputPath = path.join(thumbImagesPath, `${filename}_${width}x${height}.jpg`);

  if (fs.existsSync(outputPath)) {
    return outputPath;
  }

  if (!fs.existsSync(inputPath)) {
    throw new Error('File not found');
  }

  await sharp(inputPath).resize(width, height).toFile(outputPath);
  return outputPath;
};
