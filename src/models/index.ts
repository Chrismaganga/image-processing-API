
import path from 'path';

export const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];

export const fullImagesPath = path.join(__dirname, '../../assets/images/fjord');
export const thumbImagesPath = path.join(__dirname, '../../assets/images/thumb');

export interface ImageProcessingOptions {
    width?: number;
    height?: number;
    format?: string;
    quality?: number;
    blur?: number;
    sharpen?: boolean;
    grayscale?: boolean;
    rotate?: number;
    flip?: boolean;
    flop?: boolean;
    tint?: string;
}

export interface ImageMetadata {
    filename: string;
    format: string;
    width: number;
    height: number;
    size: number;
    created: Date;
    lastModified: Date;
    processingOptions?: ImageProcessingOptions;
}

export interface LogEntry {
    timestamp: string;
    action: 'process' | 'access' | 'upload' | 'error';
    filename: string;
    details: any;
}