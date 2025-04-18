import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { userController } from "../controllers/userController";

const router = express.Router();

router.post("/user", userController.create);
router.post("/login", userController.login);
router.get("/user/profile", authMiddleware("USER"), userController.getProfile);
router.get("/users", authMiddleware("ADMIN"), userController.listAll);
router.get("/user", authMiddleware("USER"), userController.getById);
router.put("/user", authMiddleware("USER"), userController.update);
router.delete("/user", authMiddleware("ADMIN"), userController.delete);

export default router;
