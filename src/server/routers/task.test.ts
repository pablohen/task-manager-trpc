import { TRPCError } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { describe, expect, it } from "vitest";
import { createTaskStore } from "../tasks/store";
import { appRouter, createCaller } from "./_app";

const setup = () => createCaller({ store: createTaskStore() });

describe("task router", () => {
	it("rejects a task without a title", async () => {
		await expect(setup().task.create({ title: "  " })).rejects.toMatchObject({
			code: "BAD_REQUEST",
		});
	});

	it("returns validation errors as message ids with field errors", async () => {
		const response = await fetchRequestHandler({
			endpoint: "/api/trpc",
			req: new Request("http://test/api/trpc/task.create", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ json: { title: " " } }),
			}),
			router: appRouter,
			createContext: () => ({ store: createTaskStore() }),
		});
		const { error } = await response.json();

		expect(response.status).toBe(400);
		expect(error.json.message).toBe("validation.titleRequired");
		expect(error.json.data.zodError.fieldErrors).toEqual({
			title: ["validation.titleRequired"],
		});
	});

	it("returns NOT_FOUND when updating a missing task", async () => {
		const error = await setup()
			.task.update({ id: crypto.randomUUID(), title: "Nope" })
			.catch((e: unknown) => e);

		expect(error).toBeInstanceOf(TRPCError);
		expect(error).toMatchObject({
			code: "NOT_FOUND",
			message: "Task not found",
		});
	});

	it("returns NOT_FOUND when deleting a missing task", async () => {
		await expect(
			setup().task.delete({ id: crypto.randomUUID() }),
		).rejects.toMatchObject({ code: "NOT_FOUND" });
	});

	it("returns NOT_FOUND when fetching a missing task", async () => {
		await expect(
			setup().task.byId({ id: crypto.randomUUID() }),
		).rejects.toMatchObject({ code: "NOT_FOUND" });
	});

	it("creates, lists, updates and deletes a task", async () => {
		const caller = setup();

		const created = await caller.task.create({
			title: "Ship it",
			description: "Before Friday",
		});
		expect((await caller.task.list({})).items).toEqual([created]);

		const updated = await caller.task.update({
			id: created.id,
			title: "Ship it today",
		});
		expect(updated).toMatchObject({ id: created.id, title: "Ship it today" });
		expect(await caller.task.byId({ id: created.id })).toEqual(updated);

		expect(await caller.task.delete({ id: created.id })).toEqual({
			id: created.id,
		});
		expect((await caller.task.list({})).items).toEqual([]);
	});

	it("filters the list by search term", async () => {
		const caller = setup();
		await caller.task.create({ title: "Buy milk" });
		await caller.task.create({ title: "Write report" });

		const { items } = await caller.task.list({ search: "  MILK " });

		expect(items.map((t) => t.title)).toEqual(["Buy milk"]);
	});

	it("rejects a malformed cursor", async () => {
		await expect(setup().task.list({ cursor: "abc" })).rejects.toMatchObject({
			code: "BAD_REQUEST",
		});
	});

	it("paginates the list", async () => {
		const caller = setup();
		for (let i = 0; i < 3; i++) await caller.task.create({ title: `T${i}` });

		const first = await caller.task.list({ limit: 2 });
		const second = await caller.task.list({
			limit: 2,
			cursor: first.nextCursor,
		});

		expect(first.items.map((t) => t.title)).toEqual(["T2", "T1"]);
		expect(second).toMatchObject({
			items: [{ title: "T0" }],
			nextCursor: null,
		});
	});
});
