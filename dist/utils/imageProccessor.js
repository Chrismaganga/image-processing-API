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
exports.processImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fullImagesPath = path_1.default.join(__dirname, '../../assets/full');
const thumbImagesPath = path_1.default.join(__dirname, '../../assets/thumb');
const processImage = (filename, width, height) => __awaiter(void 0, void 0, void 0, function* () {
    const inputPath = path_1.default.join(fullImagesPath, `${filename}.jpg`);
    const outputPath = path_1.default.join(thumbImagesPath, `${filename}_${width}x${height}.jpg`);
    if (fs_1.default.existsSync(outputPath)) {
        return outputPath;
    }
    if (!fs_1.default.existsSync(inputPath)) {
        throw new Error('File not found');
    }
    yield (0, sharp_1.default)(inputPath).resize(width, height).toFile(outputPath);
    return outputPath;
});
exports.processImage = processImage;
