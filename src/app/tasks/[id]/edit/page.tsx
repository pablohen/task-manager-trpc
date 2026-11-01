import { Skeleton, Stack, Title } from "@mantine/core";
import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { TaskForm } from "@/components/task-form";
import { caller } from "@/trpc/server";

export const metadata: Metadata = { title: "Edit task" };

export default function EditTaskPage({
	params,
}: PageProps<"/tasks/[id]/edit">) {
	return (
		<Stack>
			<PageBreadcrumbs
				items={[{ label: "Tasks", href: "/" }, { label: "Edit task" }]}
			/>
			<Title order={1}>Edit task</Title>
			<Suspense fallback={<Skeleton height={220} radius="md" />}>
				<EditTaskForm params={params} />
			</Suspense>
		</Stack>
	);
}

async function EditTaskForm({
	params,
}: Pick<PageProps<"/tasks/[id]/edit">, "params">) {
	const { id } = await params;
	const task = await caller.task.byId({ id }).catch((error: unknown) => {
		// A malformed id fails validation; either way there is no such task.
		if (
			error instanceof TRPCError &&
			(error.code === "NOT_FOUND" || error.code === "BAD_REQUEST")
		) {
			notFound();
		}
		throw error;
	});

	return <TaskForm task={task} />;
}
