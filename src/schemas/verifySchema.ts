import z from "zod";

export const verifySchema = z.object({
    verifyToken: z
    .string()
    .length(6, "Length of verification code should equals to 6"),
})