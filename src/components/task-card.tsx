"use client";

import { ActionIcon, Card, Group, Stack, Text, Tooltip } from "@mantine/core";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useIntl } from "react-intl";
import { useLocalizedPath } from "@/i18n/client";
import type { Task } from "@/server/tasks/schema";
import classes from "./task-card.module.css";

export function TaskCard({
	task,
	onDelete,
}: {
	task: Task;
	onDelete: (task: Task) => void;
}) {
	const intl = useIntl();
	const localize = useLocalizedPath();
	const editHref = localize(`/tasks/${task.id}/edit`);

	return (
		<Card withBorder padding="md" className={classes.card}>
			<Group justify="space-between" align="flex-start" wrap="nowrap">
				<Stack gap={4}>
					<Text
						fw={600}
						component={Link}
						href={editHref}
						className={classes.link}
					>
						{task.title}
					</Text>
					{task.description && (
						<Text size="sm" c="dimmed" style={{ whiteSpace: "pre-wrap" }}>
							{task.description}
						</Text>
					)}
					{/* Server and browser may be in different time zones. */}
					<Text
						component="time"
						size="xs"
						ff="monospace"
						c="dimmed"
						dateTime={task.createdAt.toISOString()}
						suppressHydrationWarning
					>
						{intl.formatDate(task.createdAt, {
							dateStyle: "medium",
							timeStyle: "short",
						})}
					</Text>
				</Stack>
				<Group gap={4} wrap="nowrap" className={classes.actions}>
					<Tooltip label={intl.formatMessage({ id: "task.edit" })}>
						<ActionIcon
							component={Link}
							href={editHref}
							variant="subtle"
							aria-label={intl.formatMessage(
								{ id: "task.editLabel" },
								{ title: task.title },
							)}
						>
							<PencilSimpleIcon size={20} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label={intl.formatMessage({ id: "task.delete" })}>
						<ActionIcon
							variant="subtle"
							color="red"
							aria-label={intl.formatMessage(
								{ id: "task.deleteLabel" },
								{ title: task.title },
							)}
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
