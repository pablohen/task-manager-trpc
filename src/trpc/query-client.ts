import {
	defaultShouldDehydrateQuery,
	QueryClient,
} from "@tanstack/react-query";
import superjson from "superjson";

export function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// Keeps the client from refetching what the server just prefetched.
				staleTime: 30 * 1000,
			},
			dehydrate: {
				serializeData: superjson.serialize,
				// Also send queries still in flight, so a server component can start a
				// prefetch without awaiting it and let the data stream in.
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) ||
					query.state.status === "pending",
			},
			hydrate: {
				deserializeData: superjson.deserialize,
			},
		},
	});
}
