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
exports.resizeImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const resizeImage = (filename, width, height) => __awaiter(void 0, void 0, void 0, function* () {
    // Create absolute paths for input and output
    const uploadsDir = path_1.default.resolve('uploads');
    const processedDir = path_1.default.resolve('processed');
    // Ensure directories exist
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    }
    if (!fs_1.default.existsSync(processedDir)) {
        fs_1.default.mkdirSync(processedDir, { recursive: true });
    }
    const inputPath = path_1.default.join(uploadsDir, filename);
    const outputPath = path_1.default.join(processedDir, `resized_${width}x${height}_${filename}`);
    // Check if input file exists
    if (!fs_1.default.existsSync(inputPath)) {
        throw new Error(`Input file not found: ${filename}`);
    }
    try {
        yield (0, sharp_1.default)(inputPath)
            .resize(width, height)
            .toFile(outputPath);
        return outputPath;
    }
    catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to resize the image');
    }
});
exports.resizeImage = resizeImage;
