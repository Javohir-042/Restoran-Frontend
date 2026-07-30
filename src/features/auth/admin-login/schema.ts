import { z } from "zod";

export const adminLoginSchema = z.object({
    phoneNumber: z
        .string()
        .min(1, "Telefon raqami kiritilishi shart")
        .regex(/^\+998\d{9}$/, "Format: +998901234567"),
    password: z.string().min(1, "Parol kiritilishi shart"),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;