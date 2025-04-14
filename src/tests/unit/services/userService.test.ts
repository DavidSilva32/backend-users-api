import { beforeEach, describe, expect, it, vi } from "vitest";

import { userRepository } from "../../../repositories/userRepository"
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

      // Fazendo com que o repositório `create` retorne o fakeUser
      (userRepository.create as any).mockResolvedValue(fakeUser) as any;

      const user = await userService.create({
        name: fakeUser.name,
        email: fakeUser.email,
        password: fakeUser.password,
      });

      // Verificando se a função `create` do repositório foi chamada com os parâmetros corretos
      expect(userRepository.create).toHaveBeenCalledWith(
        fakeUser.name,
        fakeUser.email,
        expect.any(String) // A senha deve ser um hash, então não podemos comparar diretamente com 'senha123'
      );
      expect(user).toEqual(fakeUser); // Verificando se o retorno foi o fakeUser
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
        expect.any(String) // A senha deve ser um hash, então não podemos comparar diretamente com 'senha123'
      );
      expect(user).toEqual(updatedUser);
    });
  });

  //   describe("login", () => {
  //     it("should login a user and return a token", async () => {
  //       const fakeUser = {
  //         id: "fake-id",
  //         email: "teste@exemplo.com",
  //         password: "hashed-password",
  //       };

  //       const token = "fake-token";

  //       // Mockando o login
  //       userRepository.userRepository.login.mockResolvedValue(fakeUser);
  //       vi.spyOn(bcrypt, 'compare').mockResolvedValue(true);  // Mockando o bcrypt.compare

  //       const result = await userService.login(fakeUser.email, "senha123");

  //       expect(result.token).toBe(token);  // Verificando se o token foi retornado
  //       expect(userRepository.userRepository.login).toHaveBeenCalledWith(fakeUser.email);
  //     });
  //   });

  // Outros testes podem ser adicionados aqui...
});
