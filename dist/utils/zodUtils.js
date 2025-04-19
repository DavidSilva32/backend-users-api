"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodErrors = formatZodErrors;
function formatZodErrors(formattedError) {
    const errors = {};
    for (const key in formattedError) {
        if (key !== "_errors" && formattedError[key]._errors.length > 0) {
            errors[key] = formattedError[key]._errors.join(", ");
        }
    }
    return errors;
}
