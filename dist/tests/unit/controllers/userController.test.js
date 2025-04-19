"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("@/controllers/userController");
const userService_1 = require("@/services/userService");
const mock_1 = require("@/tests/utils/mock");
const formatUser_1 = require("@/utils/formatUser");
const node_test_1 = require("node:test");
const vitest_1 = require("vitest");
const successResponse_1 = require("@/utils/successResponse");
vitest_1.vi.mock("@/utils/successResponse", () => ({
    sendSuccess: vitest_1.vi.fn(),
}));
vitest_1.vi.mock("@/services/userService", () => ({
    userService: {
        create: vitest_1.vi.fn(),
        listAll: vitest_1.vi.fn(),
        getById: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        delete: vitest_1.vi.fn(),
        login: vitest_1.vi.fn(),
        getProfile: vitest_1.vi.fn(),
    },
}));
(0, vitest_1.describe)("UserController", () => {
    (0, node_test_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("getById", () => {
        (0, vitest_1.it)("should return a user by id", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            const { req, res } = (0, mock_1.createMockReqRes)({
                query: { id: fakeUser.id },
            });
            vitest_1.vi.mocked(userService_1.userService.getById).mockResolvedValue(fakeUser);
            await userController_1.userController.getById(req, res);
            (0, vitest_1.expect)(userService_1.userService.getById).toHaveBeenCalledExactlyOnceWith(fakeUser.id);
            (0, vitest_1.expect)(successResponse_1.sendSuccess).toHaveBeenCalledWith(res, "User fetched successfully", (0, formatUser_1.formatUser)(fakeUser));
        });
        (0, vitest_1.it)("should throw an error if id is invalid", async () => {
            const { req, res } = (0, mock_1.createMockReqRes)({
                query: { id: "123" },
            });
            await (0, vitest_1.expect)(userController_1.userController.getById(req, res)).rejects.toThrow("ID inválido");
        });
    });
    (0, vitest_1.describe)("create", () => {
        (0, vitest_1.it)("should create a new user and return 201", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            const { req, res } = (0, mock_1.createMockReqRes)({
                body: {
                    email: fakeUser.email,
                    name: fakeUser.name,
                    password: fakeUser.password,
                },
            });
            vitest_1.vi.mocked(userService_1.userService.create).mockResolvedValue(fakeUser);
            await userController_1.userController.create(req, res);
            (0, vitest_1.expect)(userService_1.userService.create).toHaveBeenCalledWith({
                email: fakeUser.email,
                name: fakeUser.name,
                password: fakeUser.password,
            });
            (0, vitest_1.expect)(successResponse_1.sendSuccess).toHaveBeenCalledWith(res, "User created successfully", (0, formatUser_1.formatUser)(fakeUser));
        });
    });
    (0, vitest_1.describe)("update", () => {
        (0, vitest_1.it)("should update a user and return 200", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            const updatedData = { name: "Updated Name", email: "updated@email.com" };
            const { req, res } = (0, mock_1.createMockReqRes)({
                query: { id: fakeUser.id },
                body: updatedData,
            });
            vitest_1.vi.mocked(userService_1.userService.update).mockResolvedValue({
                ...fakeUser,
                ...updatedData,
            });
            await userController_1.userController.update(req, res);
            (0, vitest_1.expect)(userService_1.userService.update).toHaveBeenCalledWith({
                id: fakeUser.id,
                ...updatedData,
            });
            (0, vitest_1.expect)(successResponse_1.sendSuccess).toHaveBeenCalledWith(res, "User updated successfully", { id: fakeUser.id, name: updatedData.name, email: updatedData.email });
        });
    });
    (0, vitest_1.describe)("delete", () => {
        (0, vitest_1.it)("should delete a user and return 200", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            const { req, res } = (0, mock_1.createMockReqRes)({
                query: { id: fakeUser.id },
            });
            userService_1.userService.delete.mockResolvedValue(undefined);
            await userController_1.userController.delete(req, res);
            (0, vitest_1.expect)(userService_1.userService.delete).toHaveBeenCalledWith(fakeUser.id);
            (0, vitest_1.expect)(successResponse_1.sendSuccess).toHaveBeenCalledWith(res, "User deleted successfully");
        });
    });
    (0, vitest_1.describe)("listAll", () => {
        (0, vitest_1.it)("should return a list of users", async () => {
            const fakeUsers = [(0, mock_1.createFakeUser)(), (0, mock_1.createFakeUser)(), (0, mock_1.createFakeUser)()]; // Crie uma lista de usuários fake
            const { req, res } = (0, mock_1.createMockReqRes)();
            vitest_1.vi.mocked(userService_1.userService.listAll).mockResolvedValue(fakeUsers);
            await userController_1.userController.listAll(req, res);
            (0, vitest_1.expect)(userService_1.userService.listAll).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(successResponse_1.sendSuccess).toHaveBeenCalledWith(res, "Users fetched successfully", fakeUsers.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
            })));
        });
    });
    (0, vitest_1.describe)("getProfile", () => {
        (0, vitest_1.it)("should return the profile of the logged-in user", async () => {
            const fakeUser = (0, mock_1.createFakeUser)();
            const { req, res } = (0, mock_1.createMockReqRes)({
                user: { id: fakeUser.id, email: fakeUser.email },
            });
            vitest_1.vi.mocked(userService_1.userService.getProfile).mockResolvedValue(fakeUser);
            await userController_1.userController.getProfile(req, res);
            (0, vitest_1.expect)(userService_1.userService.getProfile).toHaveBeenCalledWith(fakeUser.id);
            (0, vitest_1.expect)(successResponse_1.sendSuccess).toHaveBeenCalledWith(res, "Profile fetched successfully", {
                id: fakeUser.id,
                name: fakeUser.name,
                email: fakeUser.email,
            });
        });
    });
    (0, vitest_1.describe)("login", () => {
        (0, vitest_1.it)("should login the user and return token", async () => {
            const credentials = {
                email: "teste@exemplo.com",
                password: "senha123",
            };
            const token = "fake-jwt-token";
            const { req, res } = (0, mock_1.createMockReqRes)({
                body: credentials,
            });
            vitest_1.vi.mocked(userService_1.userService.login).mockResolvedValue({ token });
            await userController_1.userController.login(req, res);
            (0, vitest_1.expect)(userService_1.userService.login).toHaveBeenCalledWith(credentials.email, credentials.password);
            (0, vitest_1.expect)(successResponse_1.sendSuccess).toHaveBeenCalledWith(res, "Login successful", { token });
        });
    });
});
