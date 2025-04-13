import { describe, expect, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import { generateToken } from "../../../lib/jwt";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client";
import { handleError } from "../../../utils/handleError";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.get("/protected", authMiddleware, (req, res) => {
    const user = req.user;
  res.status(200).json({ message: "Access granted", user });
  console.log({user}); // Log the response body for debugging
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleError(err, req, res, next);
});

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

    console.log(response.body); // Log the response body for debugging

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
