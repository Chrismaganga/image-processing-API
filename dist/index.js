"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_http_1 = __importDefault(require("serverless-http"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
const express_1 = __importStar(require("express"));
const port = 5000;
const app = (0, express_1.default)();
// Middleware for parsing incoming requests
app.use((0, express_1.urlencoded)({ extended: false }));
app.use((0, express_1.json)());
// Define routes
app.use('/images', imageRoutes_1.default);
console.log('util.routes');
// Home route
app.get('/', (req, res) => {
    res.send("Welcome to the Image Processing API");
});
// Start server in development mode
if (process.env.NODE_ENV === 'development') {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}
// Export serverless handler for AWS Lambda
exports.default = {
    handler: (0, serverless_http_1.default)(app),
};
