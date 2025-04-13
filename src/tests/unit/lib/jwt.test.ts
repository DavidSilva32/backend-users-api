import { describe, it, expect } from "vitest";
import { generateToken, verifyToken } from "../../../lib/jwt";

describe("jwt", () => {
  describe("generateToken", () => {
    it("should generate a valid jwt token", () => {
      const payload = { id: "123", email: "user@example.com" };
      const token = generateToken(payload);

      expect(typeof token).toBe("string");
    });
  });

  describe("verifyToken", () => {
    it("should verify a valid jwt token", () => {
      const payload = { id: "123", email: "user@example.com" };
      const token = generateToken(payload);

      const decoded = verifyToken(token);
      expect(decoded).toMatchObject(payload);
    });

    it("should throw an error for an invalid jwt token", () => {
      const invalidToken = "invalid_token";
      expect(() => verifyToken(invalidToken)).toThrow();
    });
  });
});
