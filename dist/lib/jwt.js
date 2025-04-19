"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || "your_default_secret";
const EXPIRATION_TIME = (process.env.JWT_EXPIRATION_TIME || "1h");
const generateToken = (payload) => {
    const options = { expiresIn: EXPIRATION_TIME };
    return jsonwebtoken_1.default.sign(payload, SECRET, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, SECRET);
};
exports.verifyToken = verifyToken;
