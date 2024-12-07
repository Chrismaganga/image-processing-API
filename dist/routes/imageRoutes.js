"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageController_1 = require("../controllers/imageController");
const router = express_1.default.Router();
// Get available image sizes
router.get('/sizes', imageController_1.getAvailableSizes);
// Process image with standard or custom size
router.get('/', imageController_1.getImage);
// Additional routes for future implementation
router.post('/', imageController_1.createImage);
router.put('/:id', imageController_1.updateImage);
router.delete('/:id', imageController_1.deleteImage);
exports.default = router;
