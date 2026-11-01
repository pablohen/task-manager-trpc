import { z } from "zod";

// Shared by the tRPC router and the form, so client and server validate the same way.
export const taskInputSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, "Title is required")
		.max(120, "Title must be at most 120 characters"),
	description: z
		.string()
		.trim()
		.max(1000, "Description must be at most 1000 characters")
		// An empty textarea submits "", which should mean "no description".
		.transform((value) => value || undefined)
		.optional(),
});

export type TaskInput = z.output<typeof taskInputSchema>;
export type TaskFormValues = z.input<typeof taskInputSchema>;

export type Task = {
	id: string;
	title: string;
	description?: string;
	createdAt: Date;
};

export type TaskPage = { items: Task[]; nextCursor: string | null };

// Used by both the server prefetch and the client query; they must match.
export const TASKS_PAGE_SIZE = 10;
export const getNextTaskCursor = (page: TaskPage) => page.nextCursor;
