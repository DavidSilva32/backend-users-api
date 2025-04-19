"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeUser = void 0;
exports.createMockReqRes = createMockReqRes;
const crypto_1 = require("crypto");
const vitest_1 = require("vitest");
const createFakeUser = (overrides) => ({
    id: (0, crypto_1.randomUUID)(),
    email: "teste@exemplo.com",
    name: "Teste",
    password: "senha123",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
});
exports.createFakeUser = createFakeUser;
// type PartialResponse = Partial<Response>;
function createMockReqRes(reqOverrides = {}) {
    const req = {
        ...reqOverrides,
    };
    const res = {
        status: vitest_1.vi.fn().mockReturnThis(),
        json: vitest_1.vi.fn(),
        send: vitest_1.vi.fn().mockReturnThis(),
    };
    return { req, res };
}
