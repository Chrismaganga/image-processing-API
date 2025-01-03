import { Request, Response, NextFunction } from 'express';
import { processImage } from '../utils/imageProccessor';
import path from 'path';
import fs from 'fs';
import { SUPPORTED_FORMATS, fullImagesPath } from '../models';

export const getImage = (req: Request, res: Response, next: NextFunction): void => {
    const { filename } = req.query;
    const filePath = path.join(fullImagesPath, filename as string);
    res.sendFile(filePath);
    next();
};
export const resizeImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { filename, width, height } = req.query;

        if (!filename || !width || !height) {
            res.status(400).send('Missing required query parameters: filename, width, or height.');
            return;
        }

        const processedImage = await processImage(filename as string, parseInt(width as string), parseInt(height as string));
        res.sendFile(processedImage);

        next();
    } catch (error) {
        next(error);
    }
};
export const validateImage = (req: Request, res: Response, next: NextFunction): void => {
    const { filename } = req.query;

    if (!filename) {
        res.status(400).send('Filename is required.');
        return;
    }

    const fileExtension = path.extname(filename as string).toLowerCase().substring(1);
    if (!SUPPORTED_FORMATS.includes(fileExtension)) {
        res.status(400).send('Unsupported file format.');
        return;
    }

    const filePath = path.join(fullImagesPath, filename as string);
    if (!fs.existsSync(filePath)) {
        res.status(404).send('File not found.');
        return;
    }

    next();
};