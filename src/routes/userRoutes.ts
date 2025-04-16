import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { userController } from "../controllers/userController";

const router = express.Router();

router.post("/user", userController.create);
router.post("/login", userController.login);
router.get("/user/profile", authMiddleware, userController.getProfile);
router.get("/users", authMiddleware, userController.listAll);
router.get("/user", authMiddleware, userController.getById);
router.put("/user", authMiddleware, userController.update);
router.delete("/user", authMiddleware, userController.delete);

export default router;
