// /app/schemas/auth.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "required").email("invalidEmail"),
  password: z.string().min(6, "passwordMin"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "required"),
    email: z.string().min(1, "required").email("invalidEmail"),
    phone: z
      .string()
      .min(10, "required")
      .regex(/^[0-9]+$/, "required"),
    password: z.string().min(6, "passwordMin"),
    confirmPassword: z.string().min(6, "required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordMatch",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;
