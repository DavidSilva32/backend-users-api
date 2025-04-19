import bcrypt from "bcrypt";
import { generateToken } from "../lib/jwt";
import { NotFoundError, UnauthorizedError } from "../errors/customErrors";
import { userRepository } from "../repositories/userRepository";
import { User } from "@prisma/client";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
  password?: string;
}

export const userService = {
  create: async ({ name, email, password }: CreateUserInput): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return userRepository.create(name, email, hashedPassword);
  },

  listAll: async (): Promise<User[]> => {
    return userRepository.listAll();
  },

  getById: async (id: string): Promise<User> => {
    const user = await userRepository.getById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  },

  getProfile: async (id: string): Promise<User> => {
    const user = await userRepository.getById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  },

  update: async ({
    id,
    name,
    email,
    password,
  }: UpdateUserInput): Promise<User> => {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await userRepository.update(id, name, email, hashedPassword);
    }

    return await userRepository.update(id, name, email);
  },

  delete: async (id: string): Promise<User> => {
    return userRepository.delete(id);
  },

  login: async (
    email: string,
    password: string
  ): Promise<{ token: string }> => {
    const user = await userRepository.login(email);
    const isPasswordValid =
      user && (await bcrypt.compare(password, user.password));

    if (!user || !isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { token };
  },
};
