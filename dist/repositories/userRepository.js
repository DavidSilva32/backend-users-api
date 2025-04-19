"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const prisma_1 = require("@/lib/prisma");
exports.userRepository = {
    create: async (name, email, password) => {
        return prisma_1.prisma.user.create({
            data: { name, email, password },
        });
    },
    listAll: async () => {
        return prisma_1.prisma.user.findMany();
    },
    getById: async (id) => {
        return prisma_1.prisma.user.findUnique({
            where: { id },
        });
    },
    update: async (id, name, email, password) => {
        return prisma_1.prisma.user.update({
            where: { id },
            data: { name, email, password },
        });
    },
    delete: async (id) => {
        return prisma_1.prisma.user.delete({
            where: { id },
        });
    },
    login: async (email) => {
        return prisma_1.prisma.user.findUnique({
            where: { email },
        });
    },
};
