"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageControllers_1 = require("../controllers/imageControllers");
const imageControllers_2 = require("../controllers/imageControllers");
const router = express_1.default.Router();
router.get('/', imageControllers_1.resizeImage);
router.get('/resize', imageControllers_2.validateImage, imageControllers_1.resizeImage);
router.get('/validate', imageControllers_2.validateImage);
router.get('/static', imageControllers_2.serveStaticFiles);
exports.default = router;
