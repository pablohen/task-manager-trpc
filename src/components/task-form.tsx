"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Stack, Textarea, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { AppRouter } from "@/server/routers/_app";
import { type Task, taskInputSchema } from "@/server/tasks/schema";
import { useTRPC } from "@/trpc/client";
import { LinkButton } from "./link-button";

/** Creates a task, or edits `task` when one is given. */
export function TaskForm({ task }: { task?: Task }) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		// Same schema as the server, so most mistakes never leave the browser.
		resolver: zodResolver(taskInputSchema),
		defaultValues: {
			title: task?.title ?? "",
			description: task?.description ?? "",
		},
	});

	const onSuccess = async () => {
		await queryClient.invalidateQueries({
			queryKey: trpc.task.list.infiniteQueryKey(),
		});
		notifications.show({
			color: "green",
			message: task ? "Task updated" : "Task created",
		});
		router.push("/");
	};

	const onError = (error: TRPCClientErrorLike<AppRouter>) => {
		const fieldErrors: Partial<Record<string, string[]>> =
			error.data?.zodError?.fieldErrors ?? {};
		let shownInline = false;
		for (const field of ["title", "description"] as const) {
			const message = fieldErrors[field]?.[0];
			if (message) {
				setError(field, { message });
				shownInline = true;
			}
		}
		if (!shownInline) {
			notifications.show({
				color: "red",
				title: task ? "Could not update the task" : "Could not create the task",
				message: error.message,
			});
		}
	};

	const create = useMutation(
		trpc.task.create.mutationOptions({ onSuccess, onError }),
	);
	const update = useMutation(
		trpc.task.update.mutationOptions({ onSuccess, onError }),
	);
	const mutation = task ? update : create;
	// Stay disabled after success too, until the redirect happens.
	const busy = mutation.isPending || mutation.isSuccess;

	const onSubmit = handleSubmit((values) => {
		if (task) update.mutate({ id: task.id, ...values });
		else create.mutate(values);
	});

	return (
		<form onSubmit={onSubmit} noValidate>
			<Stack>
				<TextInput
					label="Title"
					placeholder="What needs to be done?"
					withAsterisk
					autoFocus
					error={errors.title?.message}
					{...register("title")}
				/>
				<Textarea
					label="Description"
					placeholder="Optional details"
					autosize
					minRows={3}
					error={errors.description?.message}
					{...register("description")}
				/>
				<Group justify="flex-end">
					<LinkButton href="/" variant="default" disabled={busy}>
						Cancel
					</LinkButton>
					<Button type="submit" loading={busy}>
						{task ? "Save changes" : "Create task"}
					</Button>
				</Group>
			</Stack>
		</form>
	);
}
