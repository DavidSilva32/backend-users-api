import { describe, it, expect } from "vitest";
import { generateToken, verifyToken } from "../../../lib/jwt";
import { JsonWebTokenError } from 'jsonwebtoken';
import { AuthTokenPayload } from "@/types/auth";

describe("jwt", () => {
  describe("generateToken", () => {
    it("should generate a valid jwt token", () => {
      const payload: AuthTokenPayload = { id: "123", email: "user@example.com", role: "ADMIN" };
      const token = generateToken(payload);

      expect(typeof token).toBe("string"); // Verifica se o token é uma string
      expect(token).not.toBe(""); // Verifica se o token não é uma string vazia
    });
  });

  describe("verifyToken", () => {
    it("should verify a valid jwt token", () => {
      const payload: AuthTokenPayload = { id: "123", email: "user@example.com", role: "ADMIN" };
      const token = generateToken(payload);

      const decoded = verifyToken(token);
      // Verifica se o conteúdo do token é igual ao payload
      expect(decoded).toMatchObject(payload); 
    });

    it("should throw an error for an invalid jwt token", () => {
      const invalidToken = "invalid_token";
      
      // O método verifyToken lança um erro JsonWebTokenError com a mensagem "jwt malformed"
      expect(() => verifyToken(invalidToken)).toThrowError(
        new JsonWebTokenError("jwt malformed") // Verificando o erro específico lançado
      );
    });
  });
});
