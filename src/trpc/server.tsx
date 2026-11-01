import "server-only";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import type { AppRouter } from "@/server/routers/_app";
import { makeQueryClient } from "./query-client";

// One QueryClient per request, shared by every server component in it.
export const getQueryClient = cache(makeQueryClient);

// Server components read through the API route instead of calling the router
// in-process. The tasks live in memory, and on Vercel each route is a separate
// function with its own memory, so only the API route may own them.
export const client = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: "/api/trpc",
			transformer: superjson,
			// Same origin as the incoming request; its cookies are forwarded so
			// protected preview deployments let the call through.
			fetch: async (input, init) => {
				const incoming = await headers();
				const host = incoming.get("x-forwarded-host") ?? incoming.get("host");
				const protocol = incoming.get("x-forwarded-proto") ?? "http";
				return fetch(new URL(String(input), `${protocol}://${host}`), {
					...init,
					headers: {
						...Object.fromEntries(new Headers(init?.headers)),
						cookie: incoming.get("cookie") ?? "",
					},
				});
			},
		}),
	],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client,
	queryClient: getQueryClient,
});

export function HydrateClient({ children }: { children: React.ReactNode }) {
	return (
		<HydrationBoundary state={dehydrate(getQueryClient())}>
			{children}
		</HydrationBoundary>
	);
}
