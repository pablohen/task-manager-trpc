import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { taskInputSchema } from "../tasks/schema";
import { publicProcedure, router } from "../trpc";

const idInput = z.object({ id: z.uuid() });

const notFound = () =>
	new TRPCError({ code: "NOT_FOUND", message: "Task not found" });

export const taskRouter = router({
	list: publicProcedure
		.input(
			z.object({
				limit: z.number().int().min(1).max(50).default(10),
				cursor: z.string().nullish(),
			}),
		)
		.query(({ ctx, input }) => ctx.store.list(input)),

	byId: publicProcedure.input(idInput).query(({ ctx, input }) => {
		const task = ctx.store.get(input.id);
		if (!task) throw notFound();
		return task;
	}),

	create: publicProcedure
		.input(taskInputSchema)
		.mutation(({ ctx, input }) => ctx.store.create(input)),

	update: publicProcedure
		.input(idInput.extend(taskInputSchema.shape))
		.mutation(({ ctx, input: { id, ...data } }) => {
			const task = ctx.store.update(id, data);
			if (!task) throw notFound();
			return task;
		}),

	delete: publicProcedure.input(idInput).mutation(({ ctx, input }) => {
		if (!ctx.store.remove(input.id)) throw notFound();
		return { id: input.id };
	}),
});
