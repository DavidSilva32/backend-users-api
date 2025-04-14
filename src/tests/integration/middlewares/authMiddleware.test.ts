import { describe, expect, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { generateToken } from "../../../lib/jwt";
import { PrismaClient } from "@prisma/client";
import { createTestApp } from "../../utils/createTestApp";

const prisma = new PrismaClient();

const app = createTestApp();

let token: string;
let userId: string;

describe("authMiddleware", () => {
  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: "user@example.com",
        name: "Test User",
        password: "any-password",
      },
    });

    userId = user.id;
    token = generateToken({ id: user.id, email: user.email });
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: { id: userId },
    });
    await prisma.$disconnect();
  });

  it("should allow access with a valid token", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Access granted");
  });

  it("should reject access without a token", async () => {
    const response = await request(app).get("/protected");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Token not provided");
  });

  it("should reject access with an invalid token", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalid_token");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid token");
  });
});
