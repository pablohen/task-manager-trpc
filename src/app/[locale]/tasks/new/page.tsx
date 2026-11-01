import { Stack, Title } from "@mantine/core";
import type { Metadata } from "next";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { TaskForm } from "@/components/task-form";

export const metadata: Metadata = { title: "New task" };

export default function NewTaskPage() {
	return (
		<Stack>
			<PageBreadcrumbs
				items={[{ label: "Tasks", href: "/" }, { label: "New task" }]}
			/>
			<Title order={1}>New task</Title>
			<TaskForm />
		</Stack>
	);
}
