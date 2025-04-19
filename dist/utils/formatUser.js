"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUser = void 0;
const formatUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
});
exports.formatUser = formatUser;
