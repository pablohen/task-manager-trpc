import type { Task, TaskInput } from "./schema";
import { seedTasks } from "./seed";

type Entry = { task: Task; seq: number };

export type TaskPage = { items: Task[]; nextCursor: string | null };

/**
 * In-memory task store. Every task gets an increasing sequence number and the
 * pagination cursor is that number, so a page boundary stays valid even if the
 * task it points at is deleted in the meantime.
 */
export function createTaskStore(seed: Task[] = []) {
	const entries = new Map<string, Entry>();
	let lastSeq = 0;

	const insert = (task: Task) => {
		lastSeq += 1;
		entries.set(task.id, { task, seq: lastSeq });
		return task;
	};

	for (const task of seed) insert(task);

	return {
		list({
			limit,
			cursor,
		}: {
			limit: number;
			cursor?: string | null;
		}): TaskPage {
			const before = cursor ? Number(cursor) : Number.POSITIVE_INFINITY;
			const newer = [...entries.values()]
				.filter((entry) => entry.seq < before)
				.sort((a, b) => b.seq - a.seq);
			const page = newer.slice(0, limit);

			return {
				items: page.map((entry) => entry.task),
				nextCursor:
					newer.length > limit ? String(page[page.length - 1].seq) : null,
			};
		},

		get(id: string) {
			return entries.get(id)?.task;
		},

		create(input: TaskInput) {
			return insert({
				id: crypto.randomUUID(),
				title: input.title,
				description: input.description,
				createdAt: new Date(),
			});
		},

		update(id: string, input: TaskInput) {
			const entry = entries.get(id);
			if (!entry) return undefined;

			entry.task = {
				...entry.task,
				title: input.title,
				description: input.description,
			};
			return entry.task;
		},

		remove(id: string) {
			return entries.delete(id);
		},
	};
}

export type TaskStore = ReturnType<typeof createTaskStore>;

// Pinned to globalThis so dev hot reloads don't wipe the list.
const globalForStore = globalThis as { taskStore?: TaskStore };

globalForStore.taskStore ??= createTaskStore(seedTasks());

export const taskStore = globalForStore.taskStore;
