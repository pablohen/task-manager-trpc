import { createCallerFactory, router } from "../trpc";
import { taskRouter } from "./task";

export const appRouter = router({ task: taskRouter });

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
