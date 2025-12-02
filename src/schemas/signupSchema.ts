import z from "zod"
import { MessageSchema } from "./messageSchema"

export const usernameSchema = z.object({
    username: z.string().min(6, "Username atleast have 6 characters").max(20, "Username atmost have 20 characters")
})

export const signupSchema = z.object({
    username: usernameSchema,
    email: z.email({pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, message:"Invalid email address"}),
    password: z.string().min(8, "Password Length should be more than 8"),
})