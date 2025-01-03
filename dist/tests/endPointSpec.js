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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const request = (0, supertest_1.default)(server_1.default);
describe('GET /api/images', () => {
    it('should return 400 if required query parameters are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/api/images');
        expect(response.status).toBe(400);
    }));
    it('should return 200 for valid query parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/api/images?filename=test&width=100&height=100');
        expect(response.status).toBe(200);
    }));
});
