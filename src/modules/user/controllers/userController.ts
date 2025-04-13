import { createUserSchema, idSchema, loginUserSchema, updateUserSchema } from "../schemas/userSchema";
import { userService } from "../services/userService";
import { Request, Response } from "express";
import { handleError } from "../../../utils/handleError";
import { formatUser } from "../../../utils/formatUser";

type ControllerMethod = (req: Request, res: Response) => Promise<void>;


export const userController: Record<string, ControllerMethod> = {
    create: async (req: Request, res: Response) => {
      try {
        const data = createUserSchema.parse(req.body);
        const user = await userService.create(data);
        res.status(201).json(formatUser(user));
      } catch (error: any) {
        handleError(res, error);
      }
    },
  
    listAll: async (req: Request, res: Response) => {
      try {
        const users = await userService.listAll();
        const formattedUsers = users.map(formatUser);
        res.status(200).json(formattedUsers);
      } catch (error: any) {
        handleError(res, error);
      }
    },
  
    getById: async (req: Request, res: Response) => {
      try {
        const { id } = idSchema.parse(req.query);
        const user = await userService.getById(id);
        res.status(200).json(formatUser(user));
      } catch (error: any) {
        handleError(res, error);
      }
    },
  
    getProfile: async (req: Request, res: Response) => {
      try {
        const { id } = idSchema.parse(req.user);
        const user = await userService.getProfile(id);
        res.status(200).json(formatUser(user));
      } catch (error: any) {
        handleError(res, error);
      }
    },
  
    update: async (req: Request, res: Response) => {
      try {
        const { id } = idSchema.parse(req.query);
        const { name, email } = updateUserSchema.parse(req.body);
        const user = await userService.update({ id, name, email });
        res.status(200).json(formatUser(user));
      } catch (error: any) {
        handleError(res, error);
      }
    },
  
    delete: async (req: Request, res: Response) => {
      try {
        const { id } = idSchema.parse(req.query);
        await userService.delete(id);
        res.status(200).json({ message: "Usuário deletado com sucesso" });
      } catch (error: any) {
        handleError(res, error);
      }
    },
  
    login: async (req: Request, res: Response) => {
      try {
        const { email, password } = loginUserSchema.parse(req.body);
        const { token } = await userService.login(email, password);
        res.status(200).json({ token });
      } catch (error: any) {
        handleError(res, error);
      }
    },
};  