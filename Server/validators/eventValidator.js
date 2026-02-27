import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  volunteers_required: z.coerce
    .number()
    .int()
    .positive("Must be greater than 0"),
});