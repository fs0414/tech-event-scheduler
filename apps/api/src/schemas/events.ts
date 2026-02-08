import { z } from "zod";

export const eventIdSchema = z.coerce.number().int().positive();

export const eventIdParamSchema = z.object({
  id: eventIdSchema,
});

export const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  eventUrl: z.string().url().optional(),
});

export const updateEventSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  eventUrl: z.string().url().nullable().optional(),
  attendance: z.number().int().nonnegative().optional(),
});

export type EventIdParam = z.infer<typeof eventIdParamSchema>;
export type CreateEventBody = z.infer<typeof createEventSchema>;
export type UpdateEventBody = z.infer<typeof updateEventSchema>;
