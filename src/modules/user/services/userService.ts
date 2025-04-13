import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import { generateToken } from "../../../lib/jwt";
import { NotFoundError, UnauthorizedError } from "../../../errors/customErrors";
import { userRepository } from "../repositories/userRepository";

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
    create: async ({ name, email, password }: CreateUserInput) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        return userRepository.create(name, email, hashedPassword)
    },

    listAll: async () => {
        return userRepository.listAll();
    },

    getById: async (id: string) => {
        const user = await userRepository.getById(id);

        if (!user) {
            throw new NotFoundError("Usuário não encontrado");
        }

        return user;
    },

    getProfile: async (id: string) => {
        const user = await userRepository.getById(id);

        if (!user) {
            throw new NotFoundError("Usuário não encontrado");
        }

        return user;
    },

    update: async ({ id, name, email, password}: UpdateUserInput) => {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await userRepository.update(id, name, email, hashedPassword);
        }

        return await userRepository.update(id, name, email);
    },

    delete: async (id: string) => {
        return userRepository.delete(id);
    },

    login: async (email: string, password: string) => {
        const user = await userRepository.login(email);
        const isPasswordValid = user && await bcrypt.compare(password, user.password);

        if (!user || !isPasswordValid) {
            throw new UnauthorizedError("Email ou senha inválidos");
        }

        const token = generateToken({ id: user.id, email: user.email });
        return { token };
    },
};
