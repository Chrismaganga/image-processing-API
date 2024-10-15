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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = void 0;
const imageProcessor_1 = require("../utils/imageProcessor"); // Ensure this path is correct
const getImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, width, height } = req.query;
    // Validate query parameters
    if (!filename || !width || !height) {
        res.status(400).send('Missing query parameters');
        return;
    }
    try {
        // Ensure that the query params are converted to appropriate types
        const processedImage = yield (0, imageProcessor_1.resizeImage)(filename, parseInt(width), parseInt(height));
        // Send the processed image
        res.status(200).sendFile(processedImage);
    }
    catch (error) {
        console.error('Error processing image:', error); // Log the error for debugging
        res.status(500).send('Error processing image');
    }
});
exports.getImage = getImage;
