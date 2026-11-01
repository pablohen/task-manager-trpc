"use client";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<MantineProvider>
			<ModalsProvider>
				<Notifications position="top-right" />
				{children}
			</ModalsProvider>
		</MantineProvider>
	);
}
