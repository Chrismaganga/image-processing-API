"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/imageRoute.ts
const express_1 = __importDefault(require("express"));
const imageController_1 = require("../controllers/imageController");
const router = express_1.default.Router();
// Define the image route
router.get('/', imageController_1.getImage);
exports.default = router;
