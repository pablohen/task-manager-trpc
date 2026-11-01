"use client";

import { Button, Center, Loader, Skeleton, Stack, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDeleteTask } from "@/hooks/use-delete-task";
import { getNextTaskCursor, TASKS_PAGE_SIZE } from "@/server/tasks/schema";
import { useTRPC } from "@/trpc/client";
import { LinkButton } from "./link-button";
import { TaskCard } from "./task-card";

export function TaskList() {
	const trpc = useTRPC();
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isFetchNextPageError,
	} = useSuspenseInfiniteQuery(
		trpc.task.list.infiniteQueryOptions(
			{ limit: TASKS_PAGE_SIZE },
			{ getNextPageParam: getNextTaskCursor },
		),
	);
	const deleteTask = useDeleteTask();

	// A sentinel below the list loads the next page as it scrolls into view.
	const { ref: sentinelRef, entry } = useIntersection({ rootMargin: "200px" });
	const sentinelVisible = entry?.isIntersecting ?? false;

	useEffect(() => {
		// After a failed page load, wait for the retry button instead of looping.
		if (
			sentinelVisible &&
			hasNextPage &&
			!isFetchingNextPage &&
			!isFetchNextPageError
		) {
			fetchNextPage();
		}
	}, [
		sentinelVisible,
		hasNextPage,
		isFetchingNextPage,
		isFetchNextPageError,
		fetchNextPage,
	]);

	const tasks = data.pages.flatMap((page) => page.items);

	// During an optimistic delete a loaded page can be empty while more remain.
	if (tasks.length === 0 && !hasNextPage) {
		return (
			<Stack align="center" py="xl">
				<Text c="dimmed">No tasks yet.</Text>
				<LinkButton href="/tasks/new" variant="light">
					Create your first task
				</LinkButton>
			</Stack>
		);
	}

	return (
		<Stack>
			{tasks.map((task) => (
				<TaskCard key={task.id} task={task} onDelete={deleteTask} />
			))}
			<Center ref={sentinelRef} mih={40}>
				{isFetchingNextPage && <Loader size="sm" />}
				{isFetchNextPageError && !isFetchingNextPage && (
					<Stack align="center" gap="xs">
						<Text size="sm" c="red">
							Could not load more tasks.
						</Text>
						<Button size="xs" variant="light" onClick={() => fetchNextPage()}>
							Try again
						</Button>
					</Stack>
				)}
				{!hasNextPage && (
					<Text size="sm" c="dimmed">
						You've reached the end.
					</Text>
				)}
			</Center>
		</Stack>
	);
}

export function TaskListSkeleton() {
	return (
		<Stack>
			{Array.from({ length: 4 }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
				<Skeleton key={i} height={88} radius="md" />
			))}
		</Stack>
	);
}
