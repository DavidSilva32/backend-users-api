"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const userRepository_1 = require("../../../repositories/userRepository");
const prisma_1 = require("@/lib/prisma");
const mock_1 = require("../../utils/mock");
vitest_1.vi.mock("@/lib/prisma", () => ({
    prisma: {
        user: {
            create: vitest_1.vi.fn(),
            findUnique: vitest_1.vi.fn(),
            findMany: vitest_1.vi.fn(),
            update: vitest_1.vi.fn(),
            delete: vitest_1.vi.fn(),
        },
    },
}));
(0, vitest_1.describe)("userRepository", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("create", () => {
        (0, vitest_1.it)("should create a user", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            prisma_1.prisma.user.create.mockResolvedValue(fakeUser);
            const user = await userRepository_1.userRepository.create(fakeUser.name, fakeUser.email, fakeUser.password);
            (0, vitest_1.expect)(prisma_1.prisma.user.create).toHaveBeenCalledWith({
                data: {
                    name: fakeUser.name,
                    email: fakeUser.email,
                    password: fakeUser.password,
                },
            });
            (0, vitest_1.expect)(user).toEqual(fakeUser);
        });
        (0, vitest_1.it)("should throw an error if user already exists", async () => {
            const { name, email, password } = (0, mock_1.createFakeUser)();
            prisma_1.prisma.user.create.mockRejectedValue(new Error("User already exists"));
            await (0, vitest_1.expect)(userRepository_1.userRepository.create(name, email, password)).rejects.toThrow("User already exists");
        });
    });
    (0, vitest_1.describe)("getById", () => {
        (0, vitest_1.it)("should return a user by id", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            prisma_1.prisma.user.findUnique.mockResolvedValue(fakeUser);
            const user = await userRepository_1.userRepository.getById(fakeUser.id);
            (0, vitest_1.expect)(prisma_1.prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: fakeUser.id },
            });
            (0, vitest_1.expect)(user).toEqual(fakeUser);
        });
        (0, vitest_1.it)("should return null if user not found", async () => {
            prisma_1.prisma.user.findUnique.mockResolvedValue(null);
            const user = await userRepository_1.userRepository.getById("non-existent-id");
            (0, vitest_1.expect)(prisma_1.prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: "non-existent-id" },
            });
            (0, vitest_1.expect)(user).toBeNull();
        });
    });
    (0, vitest_1.describe)("listAll", () => {
        (0, vitest_1.it)("should return all users", async () => {
            const fakeUsers = [(0, mock_1.createFakeUser)(), (0, mock_1.createFakeUser)()];
            prisma_1.prisma.user.findMany.mockResolvedValue(fakeUsers);
            const users = await userRepository_1.userRepository.listAll();
            (0, vitest_1.expect)(prisma_1.prisma.user.findMany).toHaveBeenCalledWith();
            (0, vitest_1.expect)(users).toEqual(fakeUsers);
        });
        (0, vitest_1.it)("should return an empty array if no users found", async () => {
            prisma_1.prisma.user.findMany.mockResolvedValue([]);
            const users = await userRepository_1.userRepository.listAll();
            (0, vitest_1.expect)(prisma_1.prisma.user.findMany).toHaveBeenCalledWith();
            (0, vitest_1.expect)(users).toEqual([]);
        });
    });
    (0, vitest_1.describe)("update", () => {
        (0, vitest_1.it)("should update a user", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            const updatedData = { name: "Novo Nome" };
            prisma_1.prisma.user.update.mockResolvedValue(fakeUser);
            const user = await userRepository_1.userRepository.update(fakeUser.id, updatedData.name);
            (0, vitest_1.expect)(prisma_1.prisma.user.update).toHaveBeenCalledWith({
                where: { id: fakeUser.id },
                data: { name: updatedData.name },
            });
            (0, vitest_1.expect)(user).toEqual(fakeUser);
        });
        (0, vitest_1.it)("should throw an error if user not found", async () => {
            prisma_1.prisma.user.update.mockRejectedValue(new Error("User not found"));
            await (0, vitest_1.expect)(userRepository_1.userRepository.update("non-existent-id", "Novo Nome")).rejects.toThrow("User not found");
        });
    });
    (0, vitest_1.describe)("delete", () => {
        (0, vitest_1.it)("should delete a user", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            prisma_1.prisma.user.delete.mockResolvedValue(fakeUser);
            const user = await userRepository_1.userRepository.delete(fakeUser.id);
            (0, vitest_1.expect)(prisma_1.prisma.user.delete).toHaveBeenCalledWith({
                where: { id: fakeUser.id },
            });
            (0, vitest_1.expect)(user).toEqual(fakeUser);
        });
        (0, vitest_1.it)("should throw an error if user not found", async () => {
            prisma_1.prisma.user.delete.mockRejectedValue(new Error("User not found"));
            await (0, vitest_1.expect)(userRepository_1.userRepository.delete("non-existent-id")).rejects.toThrow("User not found");
        });
    });
    (0, vitest_1.describe)("login", () => {
        (0, vitest_1.it)("should return a user by email", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            prisma_1.prisma.user.findUnique.mockResolvedValue(fakeUser);
            const user = await userRepository_1.userRepository.login(fakeUser.email);
            (0, vitest_1.expect)(prisma_1.prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: fakeUser.email },
            });
            (0, vitest_1.expect)(user).toEqual(fakeUser);
        });
        (0, vitest_1.it)("should throw an error if user not found", async () => {
            prisma_1.prisma.user.findUnique.mockResolvedValue(null);
            const user = await userRepository_1.userRepository.login("non-existent-email");
            (0, vitest_1.expect)(prisma_1.prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: "non-existent-email" },
            });
            (0, vitest_1.expect)(user).toBeNull();
        });
    });
});
