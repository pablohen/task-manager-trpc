"use client";

import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
	type InfiniteData,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { useRef } from "react";
import { useIntl } from "react-intl";
import { useErrorMessage } from "@/i18n/client";
import type { Task, TaskPage } from "@/server/tasks/schema";
import { useTRPC } from "@/trpc/client";

/** Returns a function that asks for confirmation, then deletes optimistically. */
export function useDeleteTask() {
	const intl = useIntl();
	const errorMessage = useErrorMessage();
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const listKey = trpc.task.list.infiniteQueryKey();
	// Ids with a delete in flight, so a double click can't send a second request.
	const deleting = useRef(new Set<string>());

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
					title: intl.formatMessage({ id: "delete.error" }),
					message: errorMessage(error),
				});
			},
			onSuccess: () => {
				notifications.show({
					color: "green",
					message: intl.formatMessage({ id: "delete.success" }),
				});
			},
			onSettled: (_data, _error, { id }) => {
				deleting.current.delete(id);
				return queryClient.invalidateQueries({ queryKey: listKey });
			},
		}),
	);

	return (task: Task) =>
		modals.openConfirmModal({
			// A fixed id makes Mantine ignore a second open for the same task.
			modalId: `delete-${task.id}`,
			title: intl.formatMessage({ id: "delete.title" }),
			children: (
				<Text size="sm">
					{intl.formatMessage({ id: "delete.body" }, { title: task.title })}
				</Text>
			),
			labels: {
				confirm: intl.formatMessage({ id: "delete.confirm" }),
				cancel: intl.formatMessage({ id: "delete.cancel" }),
			},
			confirmProps: { color: "red" },
			onConfirm: () => {
				if (deleting.current.has(task.id)) return;
				deleting.current.add(task.id);
				mutate({ id: task.id });
			},
		});
}
