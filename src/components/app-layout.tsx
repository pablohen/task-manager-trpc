"use client";

import {
	AppShell,
	Container,
	Group,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { ListChecksIcon } from "@phosphor-icons/react";
import Link from "next/link";

// AppShell's compound parts can't be used from a server component, so the
// shell lives here and the root layout just wraps pages with it.
export function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<AppShell header={{ height: 56 }}>
			<AppShell.Header>
				<Container size="sm" h="100%">
					<Group h="100%">
						<UnstyledButton component={Link} href="/">
							<Group gap="xs">
								<ListChecksIcon size={24} weight="bold" />
								<Text fw={700}>Task Manager</Text>
							</Group>
						</UnstyledButton>
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
