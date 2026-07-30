import { z } from "zod";

export const createStaffSchema = z.object({
    firstName: z.string().min(2, "Kamida 2 ta belgi"),
    lastName: z.string().min(2, "Kamida 2 ta belgi"),
    phoneNumber: z
        .string()
        .regex(/^\+998\d{9}$/, "Format: +998901234567")
        .optional()
        .or(z.literal("")),
    pinCode: z.string().regex(/^\d{4}$/, "Aynan 4 ta raqam bo'lishi kerak"),
    role: z.enum(["KASSIR", "OFITSIANT", "OSHPAZ"], {
        message: "Rolni tanlang",
    }),
});

export const updateStaffSchema = z.object({
    firstName: z.string().min(2, "Kamida 2 ta belgi"),
    lastName: z.string().min(2, "Kamida 2 ta belgi"),
    phoneNumber: z
        .string()
        .regex(/^\+998\d{9}$/, "Format: +998901234567")
        .optional()
        .or(z.literal("")),
    role: z.enum(["KASSIR", "OFITSIANT", "OSHPAZ"]),
});

export const changePinSchema = z.object({
    newPin: z.string().regex(/^\d{4}$/, "Aynan 4 ta raqam bo'lishi kerak"),
});
