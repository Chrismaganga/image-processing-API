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
exports.serveStaticFiles = exports.validateImage = exports.resizeImage = void 0;
const imageProccessor_1 = require("../utils/imageProccessor");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const models_1 = require("../models");
const resizeImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filename, width, height } = req.query;
        if (!filename || !width || !height || isNaN(parseInt(width)) || isNaN(parseInt(height))) {
            res.status(400).send('Missing or invalid query parameters: filename, width, or height.');
            return;
        }
        const processedImage = yield (0, imageProccessor_1.processImage)(filename, parseInt(width), parseInt(height));
        res.sendFile(processedImage);
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.resizeImage = resizeImage;
const validateImage = (req, res, next) => {
    const { filename } = req.query;
    if (!filename) {
        res.status(400).send('Filename is required.');
        return;
    }
    const fileExtension = path_1.default.extname(filename).toLowerCase().substring(1);
    if (!models_1.SUPPORTED_FORMATS.includes(fileExtension)) {
        res.status(400).send('Unsupported file format.');
        return;
    }
    const filePath = path_1.default.join(models_1.fullImagesPath, filename);
    if (!fs_1.default.existsSync(filePath)) {
        res.status(404).send('File not found.');
        return;
    }
    next();
};
exports.validateImage = validateImage;
const serveStaticFiles = (req, res, next) => {
    const { filename } = req.query;
    if (!filename) {
        res.status(400).send('Filename is required.');
        return;
    }
    const filePath = path_1.default.join(models_1.fullImagesPath, filename);
    if (!fs_1.default.existsSync(filePath)) {
        res.status(404).send('File not found.');
        return;
    }
    res.sendFile(filePath, (err) => {
        if (err) {
            next(err);
        }
        else {
            next();
        }
    });
};
exports.serveStaticFiles = serveStaticFiles;
