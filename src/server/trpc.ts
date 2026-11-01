import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError, z } from "zod";
import { getTaskStore, type TaskStore } from "./tasks/store";

export type Context = { store: TaskStore };

// The store comes through context so tests can swap in a fresh one.
export const createContext = (): Context => ({ store: getTaskStore() });

const t = initTRPC.context<Context>().create({
	// superjson keeps `createdAt` a Date on the client.
	transformer: superjson,
	errorFormatter({ shape, error }) {
		if (!(error.cause instanceof ZodError)) {
			return { ...shape, data: { ...shape.data, zodError: null } };
		}
		// By default the message is the raw issue list as JSON; use the first
		// issue's message id instead and expose per-field errors for forms.
		return {
			...shape,
			message: error.cause.issues[0]?.message ?? shape.message,
			data: { ...shape.data, zodError: z.flattenError(error.cause) },
		};
	},
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
