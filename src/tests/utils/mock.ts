import { User } from "@prisma/client";
import { randomUUID } from "crypto";
import { vi } from "vitest";
import { Request, Response } from "express";

export const createFakeUser = (overrides?: Partial<User>): User => ({
  id: randomUUID(),
  email: "teste@exemplo.com",
  name: "Teste",
  password: "senha123",
  role: "USER",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

type PartialRequest = Partial<Request>;
// type PartialResponse = Partial<Response>;

export function createMockReqRes(reqOverrides: PartialRequest = {}) {
  const req = {
    ...reqOverrides,
  } as unknown as Request;

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    send: vi.fn().mockReturnThis(),
  } as unknown as Response;

  return { req, res };
}
