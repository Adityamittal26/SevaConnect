import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ chars"),
  role: z.enum(["VOLUNTEER", "ORGANIZATION"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});