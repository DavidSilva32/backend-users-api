"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
function sendSuccess(res, message = "Request completed successfully", data = null) {
    return res.status(200).json({
        message,
        data,
    });
}
