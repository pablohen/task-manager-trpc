import { Group, Stack, Title } from "@mantine/core";
import { connection } from "next/server";
import { Suspense } from "react";
import { LinkButton } from "@/components/link-button";
import { TaskList, TaskListSkeleton } from "@/components/task-list";
import { getNextTaskCursor, TASKS_PAGE_SIZE } from "@/server/tasks/schema";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export default function HomePage() {
	return (
		<Stack>
			<Group justify="space-between">
				<Title order={1}>Tasks</Title>
				<LinkButton href="/tasks/new">New task</LinkButton>
			</Group>
			<Suspense fallback={<TaskListSkeleton />}>
				<PrefetchedTaskList />
			</Suspense>
		</Stack>
	);
}

async function PrefetchedTaskList() {
	// The list lives in memory and changes between requests, so render it per
	// request instead of baking it into the static shell.
	await connection();

	// Not awaited: the pending query is dehydrated and its data streams to the
	// client as part of the SSR response.
	void getQueryClient().prefetchInfiniteQuery(
		trpc.task.list.infiniteQueryOptions(
			{ limit: TASKS_PAGE_SIZE },
			{ getNextPageParam: getNextTaskCursor },
		),
	);

	return (
		<HydrateClient>
			<TaskList />
		</HydrateClient>
	);
}
