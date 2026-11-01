import { Skeleton, Stack, Title } from "@mantine/core";
import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { TaskForm } from "@/components/task-form";
import { getIntl } from "@/i18n/server";
import { caller } from "@/trpc/server";

export async function generateMetadata(): Promise<Metadata> {
	const intl = await getIntl();
	return { title: intl.formatMessage({ id: "form.editTitle" }) };
}

export default async function EditTaskPage({
	params,
}: PageProps<"/[locale]/tasks/[id]/edit">) {
	const intl = await getIntl();
	const title = intl.formatMessage({ id: "form.editTitle" });

	return (
		<Stack>
			<PageBreadcrumbs
				items={[
					{ label: intl.formatMessage({ id: "list.title" }), href: "/" },
					{ label: title },
				]}
			/>
			<Title order={1}>{title}</Title>
			<Suspense fallback={<Skeleton height={220} radius="md" />}>
				<EditTaskForm params={params} />
			</Suspense>
		</Stack>
	);
}

async function EditTaskForm({
	params,
}: Pick<PageProps<"/[locale]/tasks/[id]/edit">, "params">) {
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
