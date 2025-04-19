"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post("/user", userController_1.userController.create);
router.post("/login", userController_1.userController.login);
router.get("/user/profile", (0, authMiddleware_1.authMiddleware)(["USER", "ADMIN"]), userController_1.userController.getProfile);
router.get("/users", (0, authMiddleware_1.authMiddleware)("ADMIN"), userController_1.userController.listAll);
router.get("/user", (0, authMiddleware_1.authMiddleware)(["USER", "ADMIN"]), userController_1.userController.getById);
router.put("/user", (0, authMiddleware_1.authMiddleware)(["USER", "ADMIN"]), userController_1.userController.update);
router.delete("/user", (0, authMiddleware_1.authMiddleware)("ADMIN"), userController_1.userController.delete);
exports.default = router;
