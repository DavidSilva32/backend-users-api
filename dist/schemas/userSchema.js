"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.updateUserSchema = exports.createUserSchema = exports.idSchema = void 0;
const zod_1 = require("zod");
exports.idSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("ID inválido"),
});
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Nome é obrigatório"),
    email: zod_1.z.string().email("Email inválido"),
    password: zod_1.z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Nome é obrigatório").optional(),
    email: zod_1.z.string().email("Email inválido").optional(),
    password: zod_1.z.string().min(6, "A senha deve ter no mínimo 6 caracteres").optional(),
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email inválido"),
    password: zod_1.z.string().min(1, "Senha é obrigatória"),
});
