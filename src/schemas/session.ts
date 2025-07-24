import { UserRole } from "@/generated/prisma";
import z from "zod";

export const sessionSchema = z.object({
    id: z.string(),
    role: z.enum(UserRole)
})