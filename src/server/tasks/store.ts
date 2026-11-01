import type { Task, TaskInput, TaskPage } from "./schema";
import { seedTasks } from "./seed";

type Entry = { task: Task; seq: number };
type StoreData = { entries: Map<string, Entry>; lastSeq: number };

/**
 * In-memory task store. Every task gets an increasing sequence number and the
 * pagination cursor is that number, so a page boundary stays valid even if the
 * task it points at is deleted in the meantime.
 */
export function createTaskStore(
	seed: Task[] = [],
	data: StoreData = { entries: new Map(), lastSeq: 0 },
) {
	const { entries } = data;

	const insert = (task: Task) => {
		data.lastSeq += 1;
		entries.set(task.id, { task, seq: data.lastSeq });
		return task;
	};

	for (const task of seed) insert(task);

	return {
		list({
			limit,
			cursor,
			search,
		}: {
			limit: number;
			cursor?: string | null;
			search?: string;
		}): TaskPage {
			const before = cursor ? Number(cursor) : Number.POSITIVE_INFINITY;
			const term = search?.toLowerCase();
			const newer = [...entries.values()]
				.filter((entry) => entry.seq < before)
				.filter(({ task }) => !term || matches(task, term))
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

function matches(task: Task, term: string) {
	return (
		task.title.toLowerCase().includes(term) ||
		(task.description?.toLowerCase().includes(term) ?? false)
	);
}

export type TaskStore = ReturnType<typeof createTaskStore>;

// Only the data is pinned to globalThis: dev hot reloads keep the list but
// still pick up code changes. Seeding is lazy so it happens during a request,
// not while Next prerenders a page that imports this module.
const globalForStore = globalThis as { taskStoreData?: StoreData };

export function getTaskStore() {
	const seeded = globalForStore.taskStoreData !== undefined;
	globalForStore.taskStoreData ??= { entries: new Map(), lastSeq: 0 };
	return createTaskStore(
		seeded ? [] : seedTasks(),
		globalForStore.taskStoreData,
	);
}
