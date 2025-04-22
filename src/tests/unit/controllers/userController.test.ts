import { userController } from "@/controllers/userController";
import { userService } from "@/services/userService";
import { createFakeUser, createMockReqRes } from "@/tests/utils/mock";
import { Request, Response } from "express";
import { formatUser } from "@/utils/formatUser";
import { beforeEach } from "node:test";
import { describe, expect, it, vi } from "vitest";

import { sendSuccess } from "@/utils/successResponse";
vi.mock("@/utils/successResponse", () => ({
  sendSuccess: vi.fn(),
}));

vi.mock("@/services/userService", () => ({
  userService: {
    create: vi.fn(),
    listAll: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    login: vi.fn(),
    getProfile: vi.fn(),
  },
}));

describe("UserController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getById", () => {
    it("should return a user by id", async () => {
      const fakeUser = createFakeUser();

      const { req, res } = createMockReqRes({
        query: { id: fakeUser.id },
      });

      vi.mocked(userService.getById).mockResolvedValue(fakeUser);

      await userController.getById(req, res);

      expect(userService.getById).toHaveBeenCalledExactlyOnceWith(fakeUser.id);
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        "User fetched successfully",
        {
          id: fakeUser.id,
          name: fakeUser.name,
          email: fakeUser.email,
          role: fakeUser.role,
        }
      );
    });

    it("should throw an error if id is invalid", async () => {
      const { req, res } = createMockReqRes({
        query: { id: "123" },
      });

      await expect(userController.getById(req, res)).rejects.toThrow(
        "Invalid ID"
      );
    });
  });

  describe("create", () => {
    it("should create a new user and return 201", async () => {
      const fakeUser = createFakeUser();
      const { req, res } = createMockReqRes({
        body: {
          email: fakeUser.email,
          name: fakeUser.name,
          password: fakeUser.password,
        },
      });

      vi.mocked(userService.create).mockResolvedValue(fakeUser);

      await userController.create(req, res);

      expect(userService.create).toHaveBeenCalledWith({
        email: fakeUser.email,
        name: fakeUser.name,
        password: fakeUser.password,
      });

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        "User created successfully",
        {
          id: fakeUser.id,
          name: fakeUser.name,
          email: fakeUser.email,
          role: fakeUser.role,
        }
      );
    });
  });

  describe("update", () => {
    it("should update a user and return 200", async () => {
      const fakeUser = createFakeUser();
      const updatedData = { name: "Updated Name", email: "updated@email.com" };

      const { req, res } = createMockReqRes({
        query: { id: fakeUser.id },
        body: updatedData,
      });

      vi.mocked(userService.update).mockResolvedValue({
        ...fakeUser,
        ...updatedData,
      });

      await userController.update(req, res);

      expect(userService.update).toHaveBeenCalledWith({
        id: fakeUser.id,
        ...updatedData,
      });

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        "User updated successfully",
        {
          id: fakeUser.id,
          name: updatedData.name,
          email: updatedData.email,
          role: fakeUser.role,
        }
      );
    });
  });

  describe("delete", () => {
    it("should delete a user and return 200", async () => {
      const fakeUser = createFakeUser();

      const { req, res } = createMockReqRes({
        query: { id: fakeUser.id },
      });

      (userService.delete as any).mockResolvedValue(undefined);

      await userController.delete(req, res);

      expect(userService.delete).toHaveBeenCalledWith(fakeUser.id);
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        "User deleted successfully"
      );
    });
  });

  describe("listAll", () => {
    it("should return a list of users", async () => {
      const fakeUsers = [createFakeUser(), createFakeUser(), createFakeUser()];

      const { req, res } = createMockReqRes();

      vi.mocked(userService.listAll).mockResolvedValue(fakeUsers);

      await userController.listAll(req, res);

      expect(userService.listAll).toHaveBeenCalledTimes(1);

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        "Users fetched successfully",
        fakeUsers.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }))
      );
    });
  });

  describe("getProfile", () => {
    it("should return the profile of the logged-in user", async () => {
      const fakeUser = createFakeUser();

      const { req, res } = createMockReqRes({
        user: { id: fakeUser.id, email: fakeUser.email, role: fakeUser.role },
      });

      vi.mocked(userService.getProfile).mockResolvedValue(fakeUser);

      await userController.getProfile(req, res);

      expect(userService.getProfile).toHaveBeenCalledWith(fakeUser.id);
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        "Profile fetched successfully",
        {
          id: fakeUser.id,
          name: fakeUser.name,
          email: fakeUser.email,
          role: fakeUser.role,
        }
      );
    });
  });

  describe("login", () => {
    it("should login the user and return token", async () => {
      const credentials = {
        email: "teste@exemplo.com",
        password: "senha123",
      };

      const token = "fake-jwt-token";

      const { req, res } = createMockReqRes({
        body: credentials,
      });

      vi.mocked(userService.login).mockResolvedValue({ token });

      await userController.login(req, res);

      expect(userService.login).toHaveBeenCalledWith(
        credentials.email,
        credentials.password
      );
      expect(sendSuccess).toHaveBeenCalledWith(res, "Login successful", {
        token,
      });
    });
  });
});
