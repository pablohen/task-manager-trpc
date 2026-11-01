import { z } from "zod";
import type { MessageId } from "@/i18n/messages";

// Validation messages are message ids, translated wherever they are shown.
const message = (id: MessageId) => id;

export const taskInputSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, message("validation.titleRequired"))
		.max(120, message("validation.titleTooLong")),
	description: z
		.string()
		.trim()
		.max(1000, message("validation.descriptionTooLong"))
		// An empty textarea submits "", which should mean "no description".
		.transform((value) => value || undefined)
		.optional(),
});

export type TaskInput = z.output<typeof taskInputSchema>;

export type Task = {
	id: string;
	title: string;
	description?: string;
	createdAt: Date;
};

export type TaskPage = { items: Task[]; nextCursor: string | null };

// Shared by the server prefetch and the client query.
export const TASKS_PAGE_SIZE = 10;
export const getNextTaskCursor = (page: TaskPage) => page.nextCursor;

/** Turns the `?q=` search param into the list's `search` input. */
export const toSearchTerm = (q: string | string[] | null | undefined) =>
	(typeof q === "string" && q.trim()) || undefined;
