import { z } from "zod";

export const subNoteSchema = z
  .object({
    title: z.string().min(1).max(25),
    description: z.string().max(100),
    date: z.number(),
    important: z.boolean(),
    level: z.number().min(1).max(3),
    id: z.string(),
  })
  .strict();

export const noteSchema = z.object({
  title: z.string().min(1).max(25),
  description: z.string().max(100),
  date: z.number(),
  important: z.boolean(),
  level: z.number().min(1).max(3),
  subNotes: subNoteSchema.array().optional(),
});

export const noteWithIdSchema = noteSchema.extend({
  id: z.string(),
  uid: z.string(),
});
