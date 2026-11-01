"use client";

import { ActionIcon, Card, Group, Stack, Text, Tooltip } from "@mantine/core";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import Link from "next/link";
import type { Task } from "@/server/tasks/schema";

const dateFormat = new Intl.DateTimeFormat("en", {
	dateStyle: "medium",
	timeStyle: "short",
});

export function TaskCard({
	task,
	onDelete,
}: {
	task: Task;
	onDelete: (task: Task) => void;
}) {
	return (
		<Card withBorder padding="md">
			<Group justify="space-between" align="flex-start" wrap="nowrap">
				<Stack gap={4}>
					<Text fw={600}>{task.title}</Text>
					{task.description && (
						<Text size="sm" c="dimmed" style={{ whiteSpace: "pre-wrap" }}>
							{task.description}
						</Text>
					)}
					{/* Server and browser may be in different time zones. */}
					<Text
						component="time"
						size="xs"
						c="dimmed"
						dateTime={task.createdAt.toISOString()}
						suppressHydrationWarning
					>
						{dateFormat.format(task.createdAt)}
					</Text>
				</Stack>
				<Group gap={4} wrap="nowrap">
					<Tooltip label="Edit">
						<ActionIcon
							component={Link}
							href={`/tasks/${task.id}/edit`}
							variant="subtle"
							aria-label={`Edit “${task.title}”`}
						>
							<PencilSimpleIcon size={20} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label="Delete">
						<ActionIcon
							variant="subtle"
							color="red"
							aria-label={`Delete “${task.title}”`}
							onClick={() => onDelete(task)}
						>
							<TrashIcon size={20} />
						</ActionIcon>
					</Tooltip>
				</Group>
			</Group>
		</Card>
	);
}
