import "server-only";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/trpc";
import { makeQueryClient } from "./query-client";

// One QueryClient per request, shared by every server component in it.
export const getQueryClient = cache(makeQueryClient);

// Calls the router in-process (no HTTP hop) and fills the request's QueryClient.
export const trpc = createTRPCOptionsProxy({
	ctx: createContext,
	router: appRouter,
	queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(createContext);

export function HydrateClient({ children }: { children: React.ReactNode }) {
	return (
		<HydrationBoundary state={dehydrate(getQueryClient())}>
			{children}
		</HydrationBoundary>
	);
}
