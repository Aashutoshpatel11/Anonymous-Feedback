import z from "zod";

export const MessageSchema = z.object({
    content: z
    .string()
    .min(6, "Minimum length should be of 6 characters")
    .max(100, "Maximum length should be less than 100 characters" )
})