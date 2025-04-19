"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const jwt_1 = require("../../../lib/jwt");
(0, vitest_1.describe)("jwt", () => {
    (0, vitest_1.describe)("generateToken", () => {
        (0, vitest_1.it)("should generate a valid jwt token", () => {
            const payload = { id: "123", email: "user@example.com" };
            const token = (0, jwt_1.generateToken)(payload);
            (0, vitest_1.expect)(typeof token).toBe("string");
        });
    });
    (0, vitest_1.describe)("verifyToken", () => {
        (0, vitest_1.it)("should verify a valid jwt token", () => {
            const payload = { id: "123", email: "user@example.com" };
            const token = (0, jwt_1.generateToken)(payload);
            const decoded = (0, jwt_1.verifyToken)(token);
            (0, vitest_1.expect)(decoded).toMatchObject(payload);
        });
        (0, vitest_1.it)("should throw an error for an invalid jwt token", () => {
            const invalidToken = "invalid_token";
            (0, vitest_1.expect)(() => (0, jwt_1.verifyToken)(invalidToken)).toThrow();
        });
    });
});
