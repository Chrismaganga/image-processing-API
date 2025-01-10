import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { ImageProcessingOptions, fullImagesPath, thumbImagesPath, ImageMetadata } from '../models';

// Ensure thumbnail directory exists
if (!fs.existsSync(thumbImagesPath)) {
    fs.mkdirSync(thumbImagesPath, { recursive: true });
}

export const processImage = async (
    filename: string,
    options: ImageProcessingOptions
): Promise<string> => {
    const inputPath = path.join(fullImagesPath, filename);
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);
    
    // Create a unique filename based on processing options
    const processingSuffix = createProcessingSuffix(options);
    const outputFormat = options.format || ext.slice(1);
    const outputFilename = `${basename}_${processingSuffix}.${outputFormat}`;
    const outputPath = path.join(thumbImagesPath, outputFilename);

    // If processed image already exists, return its path
    if (fs.existsSync(outputPath)) {
        return outputPath;
    }

    // Initialize Sharp with the input image
    let imageProcess = sharp(inputPath);

    // Apply processing options
    if (options.width || options.height) {
        imageProcess = imageProcess.resize(options.width, options.height, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        });
    }

    if (options.blur) {
        imageProcess = imageProcess.blur(options.blur);
    }

    if (options.sharpen) {
        imageProcess = imageProcess.sharpen();
    }

    if (options.grayscale) {
        imageProcess = imageProcess.grayscale();
    }

    if (options.rotate) {
        imageProcess = imageProcess.rotate(options.rotate);
    }

    if (options.flip) {
        imageProcess = imageProcess.flip();
    }

    if (options.flop) {
        imageProcess = imageProcess.flop();
    }

    if (options.tint) {
        imageProcess = imageProcess.tint(options.tint);
    }

    // Set output format and quality
    imageProcess = imageProcess.toFormat(outputFormat as keyof sharp.FormatEnum, {
        quality: options.quality || 80
    });

    // Process and save the image
    await imageProcess.toFile(outputPath);
    return outputPath;
};

const createProcessingSuffix = (options: ImageProcessingOptions): string => {
    const parts: string[] = [];
    
    if (options.width || options.height) {
        parts.push(`${options.width || 'auto'}x${options.height || 'auto'}`);
    }
    if (options.quality) parts.push(`q${options.quality}`);
    if (options.blur) parts.push(`blur${options.blur}`);
    if (options.sharpen) parts.push('sharp');
    if (options.grayscale) parts.push('gray');
    if (options.rotate) parts.push(`rot${options.rotate}`);
    if (options.flip) parts.push('flip');
    if (options.flop) parts.push('flop');
    if (options.tint) parts.push(`tint${options.tint}`);

    return parts.join('_');
};

export const getImageMetadata = async (filepath: string): Promise<ImageMetadata> => {
    const stats = fs.statSync(filepath);
    const metadata = await sharp(filepath).metadata();
    
    return {
        filename: path.basename(filepath),
        format: metadata.format || 'unknown',
        width: metadata.width || 0,
        height: metadata.height || 0,
        size: stats.size,
        created: stats.birthtime,
        lastModified: stats.mtime
    };
};
