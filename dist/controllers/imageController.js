"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.updateImage = exports.createImage = exports.getAvailableSizes = exports.getImage = void 0;
const imageProcessor_1 = require("../utils/imageProcessor");
const path_1 = __importDefault(require("path"));
const imageModel_1 = require("../models/imageModel");
// Get image with standard size
const getImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, size, custom } = req.query;
    if (!filename) {
        res.status(400).json({ error: 'Missing filename parameter' });
        return;
    }
    try {
        let width;
        let height;
        if (custom) {
            // Parse custom dimensions (format: "widthxheight")
            const [customWidth, customHeight] = custom.split('x').map(Number);
            if (isNaN(customWidth) || isNaN(customHeight) || customWidth <= 0 || customHeight <= 0) {
                res.status(400).json({ error: 'Invalid custom dimensions. Format should be "widthxheight" (e.g., 800x600)' });
                return;
            }
            width = customWidth;
            height = customHeight;
        }
        else if (size) {
            // Use standard size
            const sizeOption = size.toLowerCase();
            if (!imageModel_1.standardSizes[sizeOption]) {
                res.status(400).json({
                    error: 'Invalid size option',
                    validSizes: Object.keys(imageModel_1.standardSizes)
                });
                return;
            }
            width = imageModel_1.standardSizes[sizeOption].width;
            height = imageModel_1.standardSizes[sizeOption].height;
        }
        else {
            res.status(400).json({
                error: 'Missing size parameter',
                message: 'Use either "size" with standard options (thumbnail, small, medium, large) or "custom" with dimensions (e.g., custom=800x600)'
            });
            return;
        }
        const processedImage = yield (0, imageProcessor_1.resizeImage)(filename, width, height);
        res.sendFile(path_1.default.resolve(processedImage));
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Input file not found')) {
                res.status(404).json({
                    error: `Image '${filename}' not found in uploads directory`,
                    message: 'Please place the image in the uploads folder first'
                });
                return;
            }
            res.status(500).json({ error: 'Error processing image', details: error.message });
            return;
        }
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});
exports.getImage = getImage;
// Get available image sizes
const getAvailableSizes = (req, res) => {
    res.json({
        standardSizes: imageModel_1.standardSizes,
        usage: {
            standardSize: '/images?filename=example.jpg&size=small',
            customSize: '/images?filename=example.jpg&custom=800x600'
        }
    });
};
exports.getAvailableSizes = getAvailableSizes;
// Create a new image (placeholder for implementation)
const createImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Implementation for creating an image
    // You may want to handle file uploads and save them appropriately
    res.status(201).send('Image created successfully');
});
exports.createImage = createImage;
// Update an existing image (placeholder for implementation)
const updateImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Implementation to update image data based on the ID
    // For example, you could update metadata or replace the image
    res.status(200).send(`Image ${id} updated successfully`);
});
exports.updateImage = updateImage;
// Delete an image (placeholder for implementation)
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Implementation to delete image based on the ID
    // Make sure to handle the actual deletion logic
    res.status(200).send(`Image ${id} deleted successfully`);
});
exports.deleteImage = deleteImage;
