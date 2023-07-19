import { z } from "zod";

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8);

export const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const userSchema = z.object({
  email: emailSchema,
  access_token: z.string(),
});
