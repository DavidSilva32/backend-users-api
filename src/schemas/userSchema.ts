import { z } from "zod";

export const idSchema = z.object({
  id: z.string().uuid("Invalid ID"),
});

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
