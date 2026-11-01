"use client";

import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
	type InfiniteData,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import type { Task, TaskPage } from "@/server/tasks/schema";
import { useTRPC } from "@/trpc/client";

/** Returns a function that asks for confirmation, then deletes optimistically. */
export function useDeleteTask() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const listKey = trpc.task.list.infiniteQueryKey();

	const { mutate } = useMutation(
		trpc.task.delete.mutationOptions({
			onMutate: async ({ id }) => {
				await queryClient.cancelQueries({ queryKey: listKey });
				const previous = queryClient.getQueriesData<InfiniteData<TaskPage>>({
					queryKey: listKey,
				});
				queryClient.setQueriesData<InfiniteData<TaskPage>>(
					{ queryKey: listKey },
					(data) =>
						data && {
							...data,
							pages: data.pages.map((page) => ({
								...page,
								items: page.items.filter((task) => task.id !== id),
							})),
						},
				);
				return { previous };
			},
			onError: (error, _variables, context) => {
				for (const [key, data] of context?.previous ?? []) {
					queryClient.setQueryData(key, data);
				}
				notifications.show({
					color: "red",
					title: "Could not delete the task",
					message: error.message,
				});
			},
			onSuccess: () => {
				notifications.show({ color: "green", message: "Task deleted" });
			},
			onSettled: () => queryClient.invalidateQueries({ queryKey: listKey }),
		}),
	);

	return (task: Task) =>
		modals.openConfirmModal({
			title: "Delete task",
			children: (
				<Text size="sm">“{task.title}” will be permanently removed.</Text>
			),
			labels: { confirm: "Delete", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onConfirm: () => mutate({ id: task.id }),
		});
}
