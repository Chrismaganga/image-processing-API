"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.thumbImagesPath = exports.fullImagesPath = exports.SUPPORTED_FORMATS = void 0;
const path_1 = __importDefault(require("path"));
exports.SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
exports.fullImagesPath = path_1.default.join(__dirname, '../../assets/images/full');
exports.thumbImagesPath = path_1.default.join(__dirname, '../../assets/images/thumb');
