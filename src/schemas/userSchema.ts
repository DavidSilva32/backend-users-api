import { z } from "zod";

export const idSchema = z.object({
    id: z.string().uuid("ID inválido"),
});

export const createUserSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").optional(),
    email: z.string().email("Email inválido").optional(),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").optional(),
})

export const loginUserSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;