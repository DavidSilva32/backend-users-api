import { Request, Response } from "express";
import {
  createUserSchema,
  idSchema,
  loginUserSchema,
  updateUserSchema,
} from "../schemas/userSchema";
import { userService } from "../services/userService";
import { formatUser } from "../../../utils/formatUser";

type ControllerMethod = (req: Request, res: Response) => Promise<void>;

export const userController: Record<string, ControllerMethod> = {
  create: async (req, res) => {
    const data = createUserSchema.parse(req.body);
    const user = await userService.create(data);
    res.status(201).json(formatUser(user));
  },

  listAll: async (_req, res) => {
    const users = await userService.listAll();
    const formattedUsers = users.map(formatUser);
    res.status(200).json(formattedUsers);
  },

  getById: async (req, res) => {
    const { id } = idSchema.parse(req.query);
    const user = await userService.getById(id);
    res.status(200).json(formatUser(user));
  },

  getProfile: async (req, res) => {
    const { id } = idSchema.parse(req.user);
    const user = await userService.getProfile(id);
    res.status(200).json(formatUser(user));
  },

  update: async (req, res) => {
    const { id } = idSchema.parse(req.query);
    const { name, email } = updateUserSchema.parse(req.body);
    const user = await userService.update({ id, name, email });
    res.status(200).json(formatUser(user));
  },

  delete: async (req, res) => {
    const { id } = idSchema.parse(req.query);
    await userService.delete(id);
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  },

  login: async (req, res) => {
    const { email, password } = loginUserSchema.parse(req.body);
    const { token } = await userService.login(email, password);
    res.status(200).json({ token });
  },
};
