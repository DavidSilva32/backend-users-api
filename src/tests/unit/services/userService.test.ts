import { beforeEach, describe, expect, it, vi } from "vitest";

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

      expect(userRepository.create).toHaveBeenCalledWith(
        fakeUser.name,
        fakeUser.email,
        expect.any(String) // the password should be a hash, so we can't compare it directly with 'senha123'
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

      expect(userRepository.create).toHaveBeenCalledWith(
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

      expect(userRepository.update).toHaveBeenCalledWith(
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

      expect(userRepository.update).toHaveBeenCalledWith(
        fakeUser.id,
        updatedUser.name,
        updatedUser.email,
      );
      expect(user).toEqual(updatedUser);
    })

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

      expect(userRepository.delete).toHaveBeenCalledWith(fakeUser.id);
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

      expect(userRepository.delete).toHaveBeenCalledWith(fakeUser.id);

      expect(userRepository.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe("listAll", () => {
    it("should list all users", async () => {
      const fakeUsers = [createFakeUser(), createFakeUser()];

      (userRepository.listAll as any).mockResolvedValue(fakeUsers);

      const users = await userService.listAll();

      expect(userRepository.listAll).toHaveBeenCalledTimes(1);
      expect(users).toEqual(fakeUsers);
    });

    it("should throw an error if no users found", async () => {
      (userRepository.listAll as any).mockResolvedValue([]);

      const user = await userService.listAll();

      expect(userRepository.listAll).toHaveBeenCalledTimes(1);
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
        "Usuário não encontrado"
      );

      expect(userRepository.getById).toHaveBeenCalledWith(fakeUser.id);
      expect(userRepository.getById).toHaveBeenCalledTimes(1);
    })
  });

  // describe("getProfile", () => {})
});
