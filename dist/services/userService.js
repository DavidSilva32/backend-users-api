"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../lib/jwt");
const customErrors_1 = require("../errors/customErrors");
const userRepository_1 = require("../repositories/userRepository");
exports.userService = {
    create: async ({ name, email, password }) => {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        return userRepository_1.userRepository.create(name, email, hashedPassword);
    },
    listAll: async () => {
        return userRepository_1.userRepository.listAll();
    },
    getById: async (id) => {
        const user = await userRepository_1.userRepository.getById(id);
        if (!user) {
            throw new customErrors_1.NotFoundError("User not found");
        }
        return user;
    },
    getProfile: async (id) => {
        const user = await userRepository_1.userRepository.getById(id);
        if (!user) {
            throw new customErrors_1.NotFoundError("User not found");
        }
        return user;
    },
    update: async ({ id, name, email, password, }) => {
        if (password) {
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            return await userRepository_1.userRepository.update(id, name, email, hashedPassword);
        }
        return await userRepository_1.userRepository.update(id, name, email);
    },
    delete: async (id) => {
        return userRepository_1.userRepository.delete(id);
    },
    login: async (email, password) => {
        const user = await userRepository_1.userRepository.login(email);
        const isPasswordValid = user && (await bcrypt_1.default.compare(password, user.password));
        if (!user || !isPasswordValid) {
            throw new customErrors_1.UnauthorizedError("Invalid credentials");
        }
        const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email });
        return { token };
    },
};
