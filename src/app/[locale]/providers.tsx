"use client";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { IntlProvider } from "react-intl";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { theme } from "@/theme";
import { TRPCReactProvider } from "@/trpc/client";

export function Providers({
	locale,
	messages,
	children,
}: {
	locale: Locale;
	messages: Messages;
	children: React.ReactNode;
}) {
	return (
		<TRPCReactProvider>
			<IntlProvider locale={locale} messages={messages}>
				<MantineProvider theme={theme}>
					<ModalsProvider>
						<Notifications />
						{children}
					</ModalsProvider>
				</MantineProvider>
			</IntlProvider>
		</TRPCReactProvider>
	);
}
