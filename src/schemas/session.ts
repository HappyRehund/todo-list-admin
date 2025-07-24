import { UserRole } from "../../prisma/app/generated/prisma/client/enums"; 
import z from "zod";

export const sessionSchema = z.object({
    id: z.string(),
    role: z.enum(UserRole)
})