"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRepository_1 = require("../../../repositories/userRepository");
const mock_1 = require("../../utils/mock");
const userService_1 = require("../../../services/userService");
vitest_1.vi.mock("../../../repositories/userRepository", () => ({
    userRepository: {
        create: vitest_1.vi.fn(),
        listAll: vitest_1.vi.fn(),
        getById: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        delete: vitest_1.vi.fn(),
        login: vitest_1.vi.fn(),
    },
}));
(0, vitest_1.describe)("UserService", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("create", () => {
        (0, vitest_1.it)("should create a user", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            userRepository_1.userRepository.create.mockResolvedValue(fakeUser);
            const user = await userService_1.userService.create({
                name: fakeUser.name,
                email: fakeUser.email,
                password: fakeUser.password,
            });
            (0, vitest_1.expect)(userRepository_1.userRepository.create).toHaveBeenCalledExactlyOnceWith(fakeUser.name, fakeUser.email, vitest_1.expect.any(String));
            (0, vitest_1.expect)(user).toEqual(fakeUser);
        });
        (0, vitest_1.it)("should throw an error if user already exists", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            userRepository_1.userRepository.create.mockRejectedValueOnce(new Error("User already exists"));
            await (0, vitest_1.expect)(userService_1.userService.create({
                name: fakeUser.name,
                email: fakeUser.email,
                password: fakeUser.password,
            })).rejects.toThrow("User already exists");
            (0, vitest_1.expect)(userRepository_1.userRepository.create).toHaveBeenCalledExactlyOnceWith(fakeUser.name, fakeUser.email, vitest_1.expect.any(String));
            (0, vitest_1.expect)(userRepository_1.userRepository.create).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("update", () => {
        (0, vitest_1.it)("should update a user", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            const updatedUser = {
                ...fakeUser,
                name: "Teste Atualizado",
            };
            userRepository_1.userRepository.update.mockResolvedValue(updatedUser);
            const user = await userService_1.userService.update({
                id: fakeUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                password: updatedUser.password,
            });
            (0, vitest_1.expect)(userRepository_1.userRepository.update).toHaveBeenCalledExactlyOnceWith(fakeUser.id, updatedUser.name, updatedUser.email, vitest_1.expect.any(String));
            (0, vitest_1.expect)(user).toEqual(updatedUser);
        });
        (0, vitest_1.it)("should update a user without changing the password", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            const updatedUser = {
                ...fakeUser,
                name: "Teste Atualizado",
            };
            userRepository_1.userRepository.update.mockResolvedValue(updatedUser);
            const user = await userService_1.userService.update({
                id: fakeUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
            });
            (0, vitest_1.expect)(userRepository_1.userRepository.update).toHaveBeenCalledExactlyOnceWith(fakeUser.id, updatedUser.name, updatedUser.email);
            (0, vitest_1.expect)(user).toEqual(updatedUser);
        });
        (0, vitest_1.it)("should throw an error if user not found", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            userRepository_1.userRepository.update.mockRejectedValueOnce(new Error("User not found"));
            await (0, vitest_1.expect)(userService_1.userService.update({
                id: fakeUser.id,
                name: fakeUser.name,
                email: fakeUser.email,
                password: fakeUser.password,
            })).rejects.toThrow("User not found");
            (0, vitest_1.expect)(userRepository_1.userRepository.update).toHaveBeenCalledWith(fakeUser.id, fakeUser.name, fakeUser.email, vitest_1.expect.any(String));
            (0, vitest_1.expect)(userRepository_1.userRepository.update).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("delete", () => {
        (0, vitest_1.it)("should delete a user", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            userRepository_1.userRepository.delete.mockResolvedValue(fakeUser);
            const user = await userService_1.userService.delete(fakeUser.id);
            (0, vitest_1.expect)(userRepository_1.userRepository.delete).toHaveBeenCalledExactlyOnceWith(fakeUser.id);
            (0, vitest_1.expect)(user).toEqual(fakeUser);
        });
        (0, vitest_1.it)("should throw an error if user not found", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            userRepository_1.userRepository.delete.mockRejectedValueOnce(new Error("User not found"));
            await (0, vitest_1.expect)(userService_1.userService.delete(fakeUser.id)).rejects.toThrow("User not found");
            (0, vitest_1.expect)(userRepository_1.userRepository.delete).toHaveBeenCalledExactlyOnceWith(fakeUser.id);
        });
    });
    (0, vitest_1.describe)("listAll", () => {
        (0, vitest_1.it)("should list all users", async () => {
            const fakeUsers = [(0, mock_1.createFakeUser)(), (0, mock_1.createFakeUser)()];
            userRepository_1.userRepository.listAll.mockResolvedValue(fakeUsers);
            const users = await userService_1.userService.listAll();
            (0, vitest_1.expect)(userRepository_1.userRepository.listAll).toHaveBeenCalledExactlyOnceWith();
            (0, vitest_1.expect)(users).toEqual(fakeUsers);
        });
        (0, vitest_1.it)("should throw an error if no users found", async () => {
            userRepository_1.userRepository.listAll.mockResolvedValue([]);
            const user = await userService_1.userService.listAll();
            (0, vitest_1.expect)(userRepository_1.userRepository.listAll).toHaveBeenCalledExactlyOnceWith();
            (0, vitest_1.expect)(user).toEqual([]);
        });
    });
    (0, vitest_1.describe)("getById", () => {
        (0, vitest_1.it)("should get a user by id", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            userRepository_1.userRepository.getById.mockResolvedValue(fakeUser);
            const user = await userService_1.userService.getById(fakeUser.id);
            (0, vitest_1.expect)(userRepository_1.userRepository.getById).toHaveBeenCalledWith(fakeUser.id);
            (0, vitest_1.expect)(user).toEqual(fakeUser);
        });
        (0, vitest_1.it)("should throw an error if user not found", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            userRepository_1.userRepository.getById.mockResolvedValue(null);
            await (0, vitest_1.expect)(userService_1.userService.getById(fakeUser.id)).rejects.toThrow("User not found");
            (0, vitest_1.expect)(userRepository_1.userRepository.getById).toHaveBeenCalledWith(fakeUser.id);
            (0, vitest_1.expect)(userRepository_1.userRepository.getById).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)("getProfile", () => {
        (0, vitest_1.it)("should get a user profile", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            userRepository_1.userRepository.getById.mockResolvedValue(fakeUser);
            const user = await userService_1.userService.getProfile(fakeUser.id);
            (0, vitest_1.expect)(userRepository_1.userRepository.getById).toHaveBeenCalledExactlyOnceWith(fakeUser.id);
            (0, vitest_1.expect)(user).toEqual(fakeUser);
        });
        (0, vitest_1.it)("should throw an error if user not found", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            userRepository_1.userRepository.getById.mockResolvedValue(null);
            await (0, vitest_1.expect)(userService_1.userService.getProfile(fakeUser.id)).rejects.toThrow("User not found");
            (0, vitest_1.expect)(userRepository_1.userRepository.getById).toHaveBeenCalledExactlyOnceWith(fakeUser.id);
        });
    });
    (0, vitest_1.describe)("login", () => {
        (0, vitest_1.it)("should login a user", async () => {
            const fakeUser = (0, mock_1.createFakeUser)({ password: "$2b$10$coisadobcrypthash" });
            vitest_1.vi.spyOn(userRepository_1.userRepository, "login").mockResolvedValue(fakeUser);
            vitest_1.vi.spyOn(bcrypt_1.default, "compare").mockResolvedValue(true);
            const result = await userService_1.userService.login(fakeUser.email, "senha123");
            (0, vitest_1.expect)(userRepository_1.userRepository.login).toHaveBeenCalledExactlyOnceWith(fakeUser.email);
            (0, vitest_1.expect)(result).toHaveProperty("token");
            (0, vitest_1.expect)(typeof result.token).toBe("string");
        });
        (0, vitest_1.it)("should throw an error if user not found", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            userRepository_1.userRepository.login.mockResolvedValue(null);
            await (0, vitest_1.expect)(userService_1.userService.login(fakeUser.email, fakeUser.password)).rejects.toThrow("Invalid credentials");
            (0, vitest_1.expect)(userRepository_1.userRepository.login).toHaveBeenCalledExactlyOnceWith(fakeUser.email);
        });
        (0, vitest_1.it)("should throw an error if password is invalid", async () => {
            const fakeUser = (0, mock_1.createFakeUser)({ password: "$2b$10$coisadobcrypthash" });
            vitest_1.vi.spyOn(userRepository_1.userRepository, "login").mockResolvedValue(fakeUser);
            vitest_1.vi.spyOn(bcrypt_1.default, "compare").mockResolvedValue(false);
            await (0, vitest_1.expect)(userService_1.userService.login(fakeUser.email, "senha123")).rejects.toThrow("Invalid credentials");
            (0, vitest_1.expect)(userRepository_1.userRepository.login).toHaveBeenCalledExactlyOnceWith(fakeUser.email);
        });
    });
});
