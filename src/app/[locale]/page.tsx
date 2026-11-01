import { Stack, Title } from "@mantine/core";
import { connection } from "next/server";
import { Suspense } from "react";
import { TaskList, TaskListSkeleton } from "@/components/task-list";
import {
	getNextTaskCursor,
	TASKS_PAGE_SIZE,
	toSearchTerm,
} from "@/server/tasks/schema";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export default function HomePage({ searchParams }: PageProps<"/[locale]">) {
	return (
		<Stack>
			<Title order={1}>Tasks</Title>
			<Suspense fallback={<TaskListSkeleton />}>
				<PrefetchedTaskList searchParams={searchParams} />
			</Suspense>
		</Stack>
	);
}

async function PrefetchedTaskList({
	searchParams,
}: Pick<PageProps<"/[locale]">, "searchParams">) {
	const search = toSearchTerm((await searchParams).q);
	// The list lives in memory and changes between requests, so render it per
	// request. searchParams alone isn't enough: Next can prerender with them.
	await connection();

	// Not awaited: the pending query is dehydrated and its data streams to the
	// client as part of the SSR response.
	void getQueryClient().prefetchInfiniteQuery(
		trpc.task.list.infiniteQueryOptions(
			{ limit: TASKS_PAGE_SIZE, search },
			{ getNextPageParam: getNextTaskCursor },
		),
	);

	return (
		<HydrateClient>
			<TaskList />
		</HydrateClient>
	);
}
