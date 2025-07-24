import { UserRole } from "@/generated/prisma/enums";
import z from "zod";

export const sessionSchema = z.object({
    id: z.string(),
    role: z.enum(UserRole)
})