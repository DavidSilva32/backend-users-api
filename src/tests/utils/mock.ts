import { User } from "@prisma/client";

// Factory de usuário fake
export const createFakeUser = (overrides?: Partial<User>): User => ({
  id: "user-123",
  email: "teste@exemplo.com",
  name: "Teste",
  password: "senha123",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
