"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_FORMATS = exports.thumbImagesPath = exports.fullImagesPath = void 0;
const path_1 = __importDefault(require("path"));
// Paths to assets directories
exports.fullImagesPath = path_1.default.join(__dirname, '../../assets/full');
exports.thumbImagesPath = path_1.default.join(__dirname, '../../assets/thumb');
// Add more shared constants or reusable configurations here as needed
exports.SUPPORTED_FORMATS = ['jpg', 'jpeg']; // Supported image formats
