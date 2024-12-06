"use strict";
// import express from 'express';
// import {
//   getImage,
//   createImage,
//   updateImage,
//   deleteImage,
// } from '../controllers/imageController'; 
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
// const router = express.Router();
// // get a single image
// router.get('/', getImage); 
// // Create (POST) a new image
// router.post('/', createImage); 
// // Update (PUT) an existing image
// router.put('/:id', updateImage); 
// // Delete (DELETE) an image
// router.delete('/:id', deleteImage); 
// export default router;
const express_1 = __importDefault(require("express"));
const imageProcessor_1 = require("../utils/imageProcessor");
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
// Middleware for validating query parameters
const validateQueryParams = (req, res, next) => {
    const { filename, width, height } = req.query;
    if (!filename || !width || !height) {
        // Instead of returning the response, send the error and call next to stop further middleware
        res.status(400).send('Missing query parameters');
        return; // Ensure the function exits after sending the response
    }
    if (isNaN(parseInt(width)) || isNaN(parseInt(height))) {
        res.status(400).send('Width and height must be numbers');
        return;
    }
    next(); // If everything is fine, call next() to proceed to the route handler
};
// Route with middleware for query validation
router.get('/', validateQueryParams, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, width, height } = req.query;
    try {
        const processedImage = yield (0, imageProcessor_1.resizeImage)(filename, parseInt(width), parseInt(height));
        const imagePath = path_1.default.resolve(processedImage);
        // Send the processed image file as the response
        res.status(200).sendFile(imagePath);
    }
    catch (error) {
        console.error(error);
        // Send an error response if processing fails
        res.status(500).send('Error processing image');
    }
}));
exports.default = router;
