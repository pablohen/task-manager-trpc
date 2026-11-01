import { Stack, Title } from "@mantine/core";
import type { Metadata } from "next";
import { TaskForm } from "@/components/task-form";

export const metadata: Metadata = { title: "New task" };

export default function NewTaskPage() {
	return (
		<Stack>
			<Title order={1}>New task</Title>
			<TaskForm />
		</Stack>
	);
}
