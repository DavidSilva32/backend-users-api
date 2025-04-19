"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const jwt_1 = require("../../../lib/jwt");
const client_1 = require("@prisma/client");
const createTestApp_1 = require("../../utils/createTestApp");
const prisma = new client_1.PrismaClient();
const app = (0, createTestApp_1.createTestApp)();
let userId;
let adminId;
let userToken;
let adminToken;
(0, vitest_1.describe)("authMiddleware", () => {
    (0, vitest_1.beforeAll)(async () => {
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
        userToken = (0, jwt_1.generateToken)({ id: user.id, email: user.email, role: "USER" });
        adminToken = (0, jwt_1.generateToken)({
            id: admin.id,
            email: admin.email,
            role: "ADMIN",
        });
    });
    (0, vitest_1.afterAll)(async () => {
        await prisma.user.deleteMany({
            where: { id: { in: [userId, adminId] } },
        });
        await prisma.$disconnect();
    });
    (0, vitest_1.it)("should allow access to USER with valid token", async () => {
        const response = await (0, supertest_1.default)(app)
            .get("/user/profile")
            .set("Authorization", `Bearer ${userToken}`);
        (0, vitest_1.expect)(response.status).not.toBe(403);
        (0, vitest_1.expect)(response.status).not.toBe(401);
    });
    (0, vitest_1.it)("should allow USER route access with ADMIN token", async () => {
        const response = await (0, supertest_1.default)(app)
            .get("/user/profile")
            .set("Authorization", `Bearer ${adminToken}`);
        (0, vitest_1.expect)(response.status).not.toBe(403);
        (0, vitest_1.expect)(response.status).not.toBe(401);
    });
    (0, vitest_1.it)("should allow access to ADMIN route with valid token", async () => {
        const response = await (0, supertest_1.default)(app)
            .get("/users")
            .set("Authorization", `Bearer ${adminToken}`);
        (0, vitest_1.expect)(response.status).not.toBe(403);
        (0, vitest_1.expect)(response.status).not.toBe(401);
    });
    (0, vitest_1.it)("should reject ADMIN route access with USER token", async () => {
        const response = await (0, supertest_1.default)(app)
            .get("/users")
            .set("Authorization", `Bearer ${userToken}`);
        (0, vitest_1.expect)(response.status).toBe(403);
        (0, vitest_1.expect)(response.body.message).toBe("You do not have permission to access this resource");
    });
    (0, vitest_1.it)("should reject access without token", async () => {
        const response = await (0, supertest_1.default)(app).get("/user/profile");
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body.message).toBe("Token not provided");
    });
    (0, vitest_1.it)("should reject access with invalid token", async () => {
        const response = await (0, supertest_1.default)(app)
            .get("/user/profile")
            .set("Authorization", "Bearer invalid-token");
        (0, vitest_1.expect)(response.status).toBe(401);
        (0, vitest_1.expect)(response.body.message).toBe("Invalid token");
    });
});
