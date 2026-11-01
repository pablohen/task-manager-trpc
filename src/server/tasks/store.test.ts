import { describe, expect, it } from "vitest";
import { taskInputSchema } from "./schema";
import { createTaskStore } from "./store";

function storeWith(count: number) {
	const store = createTaskStore();
	const created = Array.from({ length: count }, (_, i) =>
		store.create({ title: `Task ${i}` }),
	);
	return { store, created };
}

describe("createTaskStore", () => {
	it("assigns an id and creation date on create", () => {
		const task = createTaskStore().create({ title: "Write tests" });

		expect(task.id).toMatch(/^[0-9a-f-]{36}$/);
		expect(task.createdAt).toBeInstanceOf(Date);
		expect(task.title).toBe("Write tests");
	});

	it("lists newest first", () => {
		const { store, created } = storeWith(3);

		const { items } = store.list({ limit: 10 });

		expect(items.map((t) => t.id)).toEqual(created.map((t) => t.id).reverse());
	});

	it("pages with a cursor and ends with a null cursor", () => {
		const { store } = storeWith(5);

		const first = store.list({ limit: 2 });
		const second = store.list({ limit: 2, cursor: first.nextCursor ?? "" });
		const third = store.list({ limit: 2, cursor: second.nextCursor ?? "" });

		expect(first.items).toHaveLength(2);
		expect(second.items).toHaveLength(2);
		expect(third.items).toHaveLength(1);
		expect(third.nextCursor).toBeNull();
		const ids = [...first.items, ...second.items, ...third.items].map(
			(t) => t.id,
		);
		expect(new Set(ids).size).toBe(5);
	});

	it("keeps paging when the cursor task was deleted", () => {
		const { store } = storeWith(4);
		const first = store.list({ limit: 2 });

		store.remove(first.items[1].id);
		const second = store.list({ limit: 2, cursor: first.nextCursor ?? "" });

		expect(second.items.map((t) => t.title)).toEqual(["Task 1", "Task 0"]);
	});

	it("returns undefined when updating an unknown task", () => {
		expect(
			createTaskStore().update(crypto.randomUUID(), { title: "x" }),
		).toBeUndefined();
	});

	it("updates title and description but keeps id and createdAt", () => {
		const store = createTaskStore();
		const task = store.create({ title: "Old", description: "Old desc" });

		const updated = store.update(task.id, { title: "New" });

		expect(updated).toEqual({
			id: task.id,
			createdAt: task.createdAt,
			title: "New",
			description: undefined,
		});
	});

	it("returns false when removing an unknown task", () => {
		expect(createTaskStore().remove(crypto.randomUUID())).toBe(false);
	});

	it("starts from the given seed", () => {
		const seed = createTaskStore().create({ title: "Seeded" });

		expect(createTaskStore([seed]).get(seed.id)).toEqual(seed);
	});
});

describe("taskInputSchema", () => {
	it("rejects a blank title", () => {
		expect(taskInputSchema.safeParse({ title: "   " }).success).toBe(false);
	});

	it("trims the title and drops an empty description", () => {
		expect(
			taskInputSchema.parse({ title: "  Buy milk  ", description: "  " }),
		).toEqual({ title: "Buy milk", description: undefined });
	});
});
