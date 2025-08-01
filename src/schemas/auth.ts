import z from "zod";

export const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

export const signUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpinput = z.infer<typeof signUpSchema>