import { describe, expect, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { generateToken } from "../../../lib/jwt";
import { PrismaClient } from "@prisma/client";
import { createTestApp } from "../../utils/createTestApp";

const prisma = new PrismaClient();
const app = createTestApp();

let userId: string;
let adminId: string;
let userToken: string;
let adminToken: string;

describe("authMiddleware", () => {
  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: "user@example.com",
        name: "Test User",
        password: "user-password",
        role: "USER",
      },
    });

    const admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin User",
        password: "admin-password",
        role: "ADMIN",
      },
    });

    userId = user.id;
    adminId = admin.id;

    userToken = generateToken({ id: user.id, email: user.email, role: "USER" });
    adminToken = generateToken({
      id: admin.id,
      email: admin.email,
      role: "ADMIN",
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { id: { in: [userId, adminId] } },
    });
    await prisma.$disconnect();
  });

  it("should allow access to USER with valid token", async () => {
    const response = await request(app)
      .get("/user/profile")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).not.toBe(403);
    expect(response.status).not.toBe(401);
  });

  it("should allow USER route access with ADMIN token", async () => {
    const response = await request(app)
      .get("/user/profile")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).not.toBe(403);
    expect(response.status).not.toBe(401);
  });

  it("should allow access to ADMIN route with valid token", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).not.toBe(403);
    expect(response.status).not.toBe(401);
  });

  it("should reject ADMIN route access with USER token", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "You do not have permission to access this resource"
    );
  });

  it("should reject access without token", async () => {
    const response = await request(app).get("/user/profile");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token not provided");
  });

  it("should reject access with invalid token", async () => {
    const response = await request(app)
      .get("/user/profile")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });
});
