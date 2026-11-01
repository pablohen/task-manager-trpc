import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";
import { AppLayout } from "@/components/app-layout";
import { locales } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import { getIntl, getLocale } from "@/i18n/server";
import { Providers } from "./providers";

// Required with Cache Components: each locale gets its own static shell.
export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
	const intl = await getIntl();
	return {
		title: intl.formatMessage({ id: "app.name" }),
		description: intl.formatMessage({ id: "app.description" }),
	};
}

export default async function RootLayout({
	children,
}: LayoutProps<"/[locale]">) {
	const locale = await getLocale();

	return (
		<html lang={locale} {...mantineHtmlProps}>
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<Providers locale={locale} messages={messages[locale]}>
					<AppLayout>{children}</AppLayout>
				</Providers>
			</body>
		</html>
	);
}
