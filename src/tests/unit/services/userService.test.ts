import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcrypt";

import { userRepository } from "../../../repositories/userRepository";
import { createFakeUser } from "../../utils/mock";
import { userService } from "../../../services/userService";

vi.mock("../../../repositories/userRepository", () => ({
  userRepository: {
    create: vi.fn(),
    listAll: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    login: vi.fn(),
  },
}));

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a user", async () => {
      const fakeUser = createFakeUser();

      (userRepository.create as any).mockResolvedValue(fakeUser) as any;

      const user = await userService.create({
        name: fakeUser.name,
        email: fakeUser.email,
        password: fakeUser.password,
      });

      expect(userRepository.create).toHaveBeenCalledExactlyOnceWith(
        fakeUser.name,
        fakeUser.email,
        expect.any(String)
      );
      expect(user).toEqual(fakeUser);
    });

    it("should throw an error if user already exists", async () => {
      const fakeUser = createFakeUser();

      (userRepository.create as any).mockRejectedValueOnce(
        new Error("User already exists")
      );

      await expect(
        userService.create({
          name: fakeUser.name,
          email: fakeUser.email,
          password: fakeUser.password,
        })
      ).rejects.toThrow("User already exists");

      expect(userRepository.create).toHaveBeenCalledExactlyOnceWith(
        fakeUser.name,
        fakeUser.email,
        expect.any(String)
      );

      expect(userRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const fakeUser = createFakeUser();

      const updatedUser = {
        ...fakeUser,
        name: "Teste Atualizado",
      };

      (userRepository.update as any).mockResolvedValue(updatedUser);

      const user = await userService.update({
        id: fakeUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        password: updatedUser.password,
      });

      expect(userRepository.update).toHaveBeenCalledExactlyOnceWith(
        fakeUser.id,
        updatedUser.name,
        updatedUser.email,
        expect.any(String)
      );
      expect(user).toEqual(updatedUser);
    });

    it("should update a user without changing the password", async () => {
      const fakeUser = createFakeUser();

      const updatedUser = {
        ...fakeUser,
        name: "Teste Atualizado",
      };

      (userRepository.update as any).mockResolvedValue(updatedUser);

      const user = await userService.update({
        id: fakeUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      });

      expect(userRepository.update).toHaveBeenCalledExactlyOnceWith(
        fakeUser.id,
        updatedUser.name,
        updatedUser.email
      );
      expect(user).toEqual(updatedUser);
    });

    it("should throw an error if user not found", async () => {
      const fakeUser = createFakeUser();

      (userRepository.update as any).mockRejectedValueOnce(
        new Error("User not found")
      );

      await expect(
        userService.update({
          id: fakeUser.id,
          name: fakeUser.name,
          email: fakeUser.email,
          password: fakeUser.password,
        })
      ).rejects.toThrow("User not found");

      expect(userRepository.update).toHaveBeenCalledWith(
        fakeUser.id,
        fakeUser.name,
        fakeUser.email,
        expect.any(String)
      );

      expect(userRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      const fakeUser = createFakeUser();

      (userRepository.delete as any).mockResolvedValue(fakeUser);

      const user = await userService.delete(fakeUser.id);

      expect(userRepository.delete).toHaveBeenCalledExactlyOnceWith(
        fakeUser.id
      );
      expect(user).toEqual(fakeUser);
    });

    it("should throw an error if user not found", async () => {
      const fakeUser = createFakeUser();

      (userRepository.delete as any).mockRejectedValueOnce(
        new Error("User not found")
      );

      await expect(userService.delete(fakeUser.id)).rejects.toThrow(
        "User not found"
      );

      expect(userRepository.delete).toHaveBeenCalledExactlyOnceWith(
        fakeUser.id
      );
    });
  });

  describe("listAll", () => {
    it("should list all users", async () => {
      const fakeUsers = [createFakeUser(), createFakeUser()];

      (userRepository.listAll as any).mockResolvedValue(fakeUsers);

      const users = await userService.listAll();

      expect(userRepository.listAll).toHaveBeenCalledExactlyOnceWith();
      expect(users).toEqual(fakeUsers);
    });

    it("should throw an error if no users found", async () => {
      (userRepository.listAll as any).mockResolvedValue([]);

      const user = await userService.listAll();

      expect(userRepository.listAll).toHaveBeenCalledExactlyOnceWith();
      expect(user).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should get a user by id", async () => {
      const fakeUser = createFakeUser();

      (userRepository.getById as any).mockResolvedValue(fakeUser);

      const user = await userService.getById(fakeUser.id);
      expect(userRepository.getById).toHaveBeenCalledWith(fakeUser.id);
      expect(user).toEqual(fakeUser);
    });

    it("should throw an error if user not found", async () => {
      const fakeUser = createFakeUser();

      (userRepository.getById as any).mockResolvedValue(null);

      await expect(userService.getById(fakeUser.id)).rejects.toThrow(
        "User not found"
      );

      expect(userRepository.getById).toHaveBeenCalledWith(fakeUser.id);
      expect(userRepository.getById).toHaveBeenCalledTimes(1);
    });
  });

  describe("getProfile", () => {
    it("should get a user profile", async () => {
      const fakeUser = createFakeUser();

      (userRepository.getById as any).mockResolvedValue(fakeUser);

      const user = await userService.getProfile(fakeUser.id);

      expect(userRepository.getById).toHaveBeenCalledExactlyOnceWith(
        fakeUser.id
      );
      expect(user).toEqual(fakeUser);
    });

    it("should throw an error if user not found", async () => {
      const fakeUser = createFakeUser();

      (userRepository.getById as any).mockResolvedValue(null);

      await expect(userService.getProfile(fakeUser.id)).rejects.toThrow(
        "User not found"
      );

      expect(userRepository.getById).toHaveBeenCalledExactlyOnceWith(
        fakeUser.id
      );
    });
  });

  describe("login", () => {
    it("should login a user", async () => {
      const fakeUser = createFakeUser({ password: "$2b$10$coisadobcrypthash" });

      vi.spyOn(userRepository, "login").mockResolvedValue(fakeUser);
      vi.spyOn(bcrypt, "compare").mockResolvedValue(true as unknown as void);

      const result = await userService.login(fakeUser.email, "senha123");

      expect(userRepository.login).toHaveBeenCalledExactlyOnceWith(
        fakeUser.email
      );
      expect(result).toHaveProperty("token");
      expect(typeof result.token).toBe("string");
    });

    it("should throw an error if user not found", async () => {
      const fakeUser = createFakeUser();

      (userRepository.login as any).mockResolvedValue(null);

      await expect(
        userService.login(fakeUser.email, fakeUser.password)
      ).rejects.toThrow("Invalid credentials");

      expect(userRepository.login).toHaveBeenCalledExactlyOnceWith(
        fakeUser.email
      );
    });

    it("should throw an error if password is invalid", async () => {
      const fakeUser = createFakeUser({ password: "$2b$10$coisadobcrypthash" });

      vi.spyOn(userRepository, "login").mockResolvedValue(fakeUser);
      vi.spyOn(bcrypt, "compare").mockResolvedValue(false as unknown as void);

      await expect(
        userService.login(fakeUser.email, "senha123")
      ).rejects.toThrow("Invalid credentials");

      expect(userRepository.login).toHaveBeenCalledExactlyOnceWith(
        fakeUser.email
      );
    });
  });
});
