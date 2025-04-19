"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
const zod_1 = require("zod");
const zodUtils_1 = require("../utils/zodUtils");
const customErrors_1 = require("../errors/customErrors");
function handleError(err, req, res, next) {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: "Invalid data",
            fields: (0, zodUtils_1.formatZodErrors)(err.format()),
        });
    }
    if (err instanceof customErrors_1.BadRequestError ||
        err instanceof customErrors_1.NotFoundError ||
        err instanceof customErrors_1.UnauthorizedError ||
        err instanceof customErrors_1.ForbiddenError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    if (err.code === "P2002") {
        return res.status(409).json({ message: "Email already registered" });
    }
    if (err.code === "P2025") {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(500).json({
        message: "Internal server error",
        details: err.message,
    });
}
