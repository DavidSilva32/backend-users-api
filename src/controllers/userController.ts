import { Request, Response } from "express";
import {
  createUserSchema,
  idSchema,
  loginUserSchema,
  updateUserSchema,
} from "../schemas/userSchema";
import { userService } from "../services/userService";
import { formatUser } from "@/utils/formatUser";
import { sendSuccess } from "@/utils/successResponse";

type ControllerMethod = (req: Request, res: Response) => Promise<void>;

export const userController: Record<string, ControllerMethod> = {
  create: async (req, res) => {
    const data = createUserSchema.parse(req.body);
    const user = await userService.create(data);
    sendSuccess(res, "User created successfully", formatUser(user));
  },

  listAll: async (_req, res) => {
    const users = await userService.listAll();
    const formattedUsers = users.map(formatUser);
    sendSuccess(res, "Users fetched successfully", formattedUsers);
  },

  getById: async (req, res) => {
    const { id } = idSchema.parse(req.query);
    const user = await userService.getById(id);
    sendSuccess(res, "User fetched successfully", formatUser(user));
  },

  getProfile: async (req, res) => {
    const { id } = idSchema.parse(req.user);
    const user = await userService.getProfile(id);
    sendSuccess(res, "Profile fetched successfully", formatUser(user));
  },

  update: async (req, res) => {
    const { id } = idSchema.parse(req.query);
    const { name, email } = updateUserSchema.parse(req.body);
    const user = await userService.update({ id, name, email });
    sendSuccess(res, "User updated successfully", formatUser(user));
  },

  delete: async (req, res) => {
    const { id } = idSchema.parse(req.query);
    await userService.delete(id);
    sendSuccess(res, "User deleted successfully");
  },

  login: async (req, res) => {
    const { email, password } = loginUserSchema.parse(req.body);
    const { token } = await userService.login(email, password);
    sendSuccess(res, "Login successful", { token });
  },
};
