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
exports.getImageMetadata = exports.processImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const models_1 = require("../models");
// Ensure thumbnail directory exists
if (!fs_1.default.existsSync(models_1.thumbImagesPath)) {
    fs_1.default.mkdirSync(models_1.thumbImagesPath, { recursive: true });
}
const processImage = (filename, options) => __awaiter(void 0, void 0, void 0, function* () {
    const inputPath = path_1.default.join(models_1.fullImagesPath, filename);
    const ext = path_1.default.extname(filename);
    const basename = path_1.default.basename(filename, ext);
    // Create a unique filename based on processing options
    const processingSuffix = createProcessingSuffix(options);
    const outputFormat = options.format || ext.slice(1);
    const outputFilename = `${basename}_${processingSuffix}.${outputFormat}`;
    const outputPath = path_1.default.join(models_1.thumbImagesPath, outputFilename);
    // If processed image already exists, return its path
    if (fs_1.default.existsSync(outputPath)) {
        return outputPath;
    }
    // Initialize Sharp with the input image
    let imageProcess = (0, sharp_1.default)(inputPath);
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
    imageProcess = imageProcess.toFormat(outputFormat, {
        quality: options.quality || 80
    });
    // Process and save the image
    yield imageProcess.toFile(outputPath);
    return outputPath;
});
exports.processImage = processImage;
const createProcessingSuffix = (options) => {
    const parts = [];
    if (options.width || options.height) {
        parts.push(`${options.width || 'auto'}x${options.height || 'auto'}`);
    }
    if (options.quality)
        parts.push(`q${options.quality}`);
    if (options.blur)
        parts.push(`blur${options.blur}`);
    if (options.sharpen)
        parts.push('sharp');
    if (options.grayscale)
        parts.push('gray');
    if (options.rotate)
        parts.push(`rot${options.rotate}`);
    if (options.flip)
        parts.push('flip');
    if (options.flop)
        parts.push('flop');
    if (options.tint)
        parts.push(`tint${options.tint}`);
    return parts.join('_');
};
const getImageMetadata = (filepath) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = fs_1.default.statSync(filepath);
    const metadata = yield (0, sharp_1.default)(filepath).metadata();
    return {
        filename: path_1.default.basename(filepath),
        format: metadata.format || 'unknown',
        width: metadata.width || 0,
        height: metadata.height || 0,
        size: stats.size,
        created: stats.birthtime,
        lastModified: stats.mtime
    };
});
exports.getImageMetadata = getImageMetadata;
