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
exports.resizeImage = void 0;
const imageProccessor_1 = require("../utils/imageProccessor");
const resizeImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filename, width, height } = req.query;
        if (!filename || !width || !height) {
            res.status(400).send('Missing required query parameters: filename, width, or height.');
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
