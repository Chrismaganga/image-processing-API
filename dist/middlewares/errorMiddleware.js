"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (err, req, res, next) => {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
};
exports.default = errorMiddleware;
