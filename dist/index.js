"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use('/api/images', imageRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Hello world');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;