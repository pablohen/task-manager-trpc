"use client";

import {
	ActionIcon,
	AppShell,
	Box,
	Button,
	Container,
	Group,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { ListChecksIcon, PlusIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { Suspense } from "react";
import { useIntl } from "react-intl";
import { useLocalizedPath } from "@/i18n/client";
import { RouteProgress } from "./route-progress";
import { TaskSearch, TaskSearchFallback } from "./task-search";

// AppShell's compound parts can't be used from a server component, so the
// shell lives here and the root layout just wraps pages with it.
export function AppLayout({ children }: { children: React.ReactNode }) {
	const intl = useIntl();
	const localize = useLocalizedPath();
	const newTask = intl.formatMessage({ id: "nav.newTask" });

	return (
		<AppShell header={{ height: 64 }}>
			<Suspense>
				<RouteProgress />
			</Suspense>
			<AppShell.Header>
				<Container size="sm" h="100%">
					<Group h="100%" gap="sm" wrap="nowrap">
						<UnstyledButton
							component={Link}
							href={localize("/")}
							aria-label={intl.formatMessage({ id: "nav.home" })}
						>
							<Group gap="xs" wrap="nowrap">
								<ListChecksIcon size={28} weight="bold" />
								<Text fw={700} visibleFrom="sm">
									{intl.formatMessage({ id: "app.name" })}
								</Text>
							</Group>
						</UnstyledButton>
						<Box flex={1}>
							{/* useSearchParams needs a Suspense boundary. */}
							<Suspense fallback={<TaskSearchFallback />}>
								<TaskSearch />
							</Suspense>
						</Box>
						{/* Icon-only on phones to leave room for the search box. */}
						<ActionIcon
							component={Link}
							href={localize("/tasks/new")}
							variant="filled"
							aria-label={newTask}
							hiddenFrom="xs"
						>
							<PlusIcon size={20} weight="bold" />
						</ActionIcon>
						<Button
							component={Link}
							href={localize("/tasks/new")}
							leftSection={<PlusIcon size={18} weight="bold" />}
							visibleFrom="xs"
						>
							{newTask}
						</Button>
					</Group>
				</Container>
			</AppShell.Header>
			<AppShell.Main>
				<Container size="sm" py={{ base: "md", sm: "xl" }}>
					{children}
				</Container>
			</AppShell.Main>
		</AppShell>
	);
}
