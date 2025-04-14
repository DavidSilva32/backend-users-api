import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export const userRepository = {
  create: async (
    name: string,
    email: string,
    password: string
  ): Promise<User> => {
    return prisma.user.create({
      data: { name, email, password },
    });
  },
  listAll: async (): Promise<User[]> => {
    return prisma.user.findMany();
  },
  getById: async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { id },
    });
  },
  update: async (
    id: string,
    name?: string,
    email?: string,
    password?: string
  ): Promise<User> => {
    return prisma.user.update({
      where: { id },
      data: { name, email, password },
    });
  },
  delete: async (id: string): Promise<User> => {
    return prisma.user.delete({
      where: { id },
    });
  },
  login: async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { email },
    });
  },
};
