"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestApp = createTestApp;
const express_1 = __importDefault(require("express"));
const handleError_1 = require("../../middlewares/handleError");
const userRoutes_1 = __importDefault(require("@/routes/userRoutes"));
function createTestApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(userRoutes_1.default);
    app.use((err, req, res, next) => {
        (0, handleError_1.handleError)(err, req, res, next);
    });
    return app;
}
