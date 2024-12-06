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
const imageProcessor_1 = require("../utils/imageProcessor");
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path")); // Import path module for handling file paths
jest.mock('sharp');
describe('resizeImage', () => {
    const mockInputPath = 'images/image.jpg';
    const mockOutputPath = 'processed/resized_200x300_image.jpg';
    const mockSharpInstance = {
        resize: jest.fn().mockReturnThis(),
        toFile: jest.fn(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
        sharp_1.default.mockReturnValue(mockSharpInstance);
    });
    it('should resize the image and return the output path', () => __awaiter(void 0, void 0, void 0, function* () {
        mockSharpInstance.toFile.mockResolvedValueOnce(mockOutputPath);
        const result = yield (0, imageProcessor_1.resizeImage)(mockInputPath, 200, 300);
        expect(sharp_1.default).toHaveBeenCalledWith(mockInputPath);
        expect(mockSharpInstance.resize).toHaveBeenCalledWith(200, 300);
        expect(mockSharpInstance.toFile).toHaveBeenCalledWith(expect.stringContaining('resized_200x300_image.jpg'));
        // Compare only the basename of the paths to avoid full path issues
        expect(path_1.default.basename(result)).toBe(path_1.default.basename(mockOutputPath));
    }));
    it('should throw an error if resizing fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error('Resizing error');
        mockSharpInstance.toFile.mockRejectedValueOnce(mockError);
        // Mock console.error to suppress output during the test
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        yield expect((0, imageProcessor_1.resizeImage)(mockInputPath, 200, 300)).rejects.toThrow('Failed to resize the image');
        // Restore the original console.error
        consoleErrorSpy.mockRestore();
    }));
});
