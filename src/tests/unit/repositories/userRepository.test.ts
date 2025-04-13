import { describe, it, expect, vi, beforeEach } from "vitest";
import { userRepository } from "../../../modules/user/repositories/userRepository";
import { prisma } from "../../../lib/prisma";
import type { User } from "@prisma/client";

vi.mock("../../../lib/prisma", () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const createFakeUser = (overrides?: Partial<User>): User => ({
  id: "user-123",
  email: "teste@exemplo.com",
  name: "Teste",
  password: "senha123",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("userRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a user", async () => {
      const fakeUser = createFakeUser();

      (prisma.user.create as any).mockResolvedValue(fakeUser);

      const user = await userRepository.create(
        fakeUser.name,
        fakeUser.email,
        fakeUser.password
      );

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: fakeUser.name,
          email: fakeUser.email,
          password: fakeUser.password,
        },
      });
      expect(user).toEqual(fakeUser);
    });

    it("should throw an error if user already exists", async () => {
      const { name, email, password } = createFakeUser();

      (prisma.user.create as any).mockRejectedValue(
        new Error("User already exists")
      );

      await expect(
        userRepository.create(name, email, password)
      ).rejects.toThrow("User already exists");
    });
  });

  describe("getById", () => {
    it("should return a user by id", async () => {
      const fakeUser = createFakeUser();

      (prisma.user.findUnique as any).mockResolvedValue(fakeUser);
      const user = await userRepository.getById(fakeUser.id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: fakeUser.id },
      });
      expect(user).toEqual(fakeUser);
    });

    it("should return null if user not found", async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      const user = await userRepository.getById("non-existent-id");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "non-existent-id" },
      });
      expect(user).toBeNull();
    });
  });

  describe("listAll", () => {
    it("should return all users", async () => {
      const fakeUsers = [createFakeUser(), createFakeUser()];

      (prisma.user.findMany as any).mockResolvedValue(fakeUsers);
      const users = await userRepository.listAll();
      expect(prisma.user.findMany).toHaveBeenCalledWith();
      expect(users).toEqual(fakeUsers);
    });

    it("should return an empty array if no users found", async () => {
      (prisma.user.findMany as any).mockResolvedValue([]);

      const users = await userRepository.listAll();

      expect(prisma.user.findMany).toHaveBeenCalledWith();
      expect(users).toEqual([]);
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const fakeUser = createFakeUser();
      const updatedData = { name: "Novo Nome" };

      (prisma.user.update as any).mockResolvedValue(fakeUser);

      const user = await userRepository.update(fakeUser.id, updatedData.name);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: fakeUser.id },
        data: { name: updatedData.name },
      });
      expect(user).toEqual(fakeUser);
    });

    it("should throw an error if user not found", async () => {
      (prisma.user.update as any).mockRejectedValue(
        new Error("User not found")
      );

      await expect(
        userRepository.update("non-existent-id", "Novo Nome")
      ).rejects.toThrow("User not found");
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      const fakeUser = createFakeUser();

      (prisma.user.delete as any).mockResolvedValue(fakeUser);

      const user = await userRepository.delete(fakeUser.id);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: fakeUser.id },
      });
      expect(user).toEqual(fakeUser);
    });

    it("should throw an error if user not found", async () => {
      (prisma.user.delete as any).mockRejectedValue(
        new Error("User not found")
      );

      await expect(userRepository.delete("non-existent-id")).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("login", () => {
    it("should return a user by email", async () => {
      const fakeUser = createFakeUser();

      (prisma.user.findUnique as any).mockResolvedValue(fakeUser);
      const user = await userRepository.login(fakeUser.email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: fakeUser.email },
      });
      expect(user).toEqual(fakeUser);
    });

    it("should throw an error if user not found", async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      const user = await userRepository.login("non-existent-email");
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "non-existent-email" },
      })
      expect(user).toBeNull();
    });
  });
});
