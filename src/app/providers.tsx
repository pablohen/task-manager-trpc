"use client";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { TRPCReactProvider } from "@/trpc/client";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<TRPCReactProvider>
			<MantineProvider>
				<ModalsProvider>
					<Notifications />
					{children}
				</ModalsProvider>
			</MantineProvider>
		</TRPCReactProvider>
	);
}
