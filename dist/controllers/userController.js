"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const userSchema_1 = require("../schemas/userSchema");
const userService_1 = require("../services/userService");
const formatUser_1 = require("@/utils/formatUser");
const successResponse_1 = require("@/utils/successResponse");
exports.userController = {
    create: async (req, res) => {
        const data = userSchema_1.createUserSchema.parse(req.body);
        const user = await userService_1.userService.create(data);
        (0, successResponse_1.sendSuccess)(res, "User created successfully", (0, formatUser_1.formatUser)(user));
    },
    listAll: async (_req, res) => {
        const users = await userService_1.userService.listAll();
        const formattedUsers = users.map(formatUser_1.formatUser);
        (0, successResponse_1.sendSuccess)(res, "Users fetched successfully", formattedUsers);
    },
    getById: async (req, res) => {
        const { id } = userSchema_1.idSchema.parse(req.query);
        const user = await userService_1.userService.getById(id);
        (0, successResponse_1.sendSuccess)(res, "User fetched successfully", (0, formatUser_1.formatUser)(user));
    },
    getProfile: async (req, res) => {
        const { id } = userSchema_1.idSchema.parse(req.user);
        const user = await userService_1.userService.getProfile(id);
        (0, successResponse_1.sendSuccess)(res, "Profile fetched successfully", (0, formatUser_1.formatUser)(user));
    },
    update: async (req, res) => {
        const { id } = userSchema_1.idSchema.parse(req.query);
        const { name, email } = userSchema_1.updateUserSchema.parse(req.body);
        const user = await userService_1.userService.update({ id, name, email });
        (0, successResponse_1.sendSuccess)(res, "User updated successfully", (0, formatUser_1.formatUser)(user));
    },
    delete: async (req, res) => {
        const { id } = userSchema_1.idSchema.parse(req.query);
        await userService_1.userService.delete(id);
        (0, successResponse_1.sendSuccess)(res, "User deleted successfully");
    },
    login: async (req, res) => {
        const { email, password } = userSchema_1.loginUserSchema.parse(req.body);
        const { token } = await userService_1.userService.login(email, password);
        (0, successResponse_1.sendSuccess)(res, "Login successful", { token });
    },
};
