"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("@/lib/jwt");
const customErrors_1 = require("../errors/customErrors");
const authMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return next(new customErrors_1.UnauthorizedError("Token not provided"));
            }
            const token = authHeader.split(" ")[1];
            const decoded = (0, jwt_1.verifyToken)(token);
            req.user = decoded;
            // Verificando se o role do usuário está entre os permitidos
            if (requiredRoles) {
                const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
                if (!rolesArray.includes(req.user.role)) {
                    return next(new customErrors_1.ForbiddenError("You do not have permission to access this resource"));
                }
            }
            next();
        }
        catch (error) {
            return next(new customErrors_1.UnauthorizedError("Invalid token"));
        }
    };
};
exports.authMiddleware = authMiddleware;
