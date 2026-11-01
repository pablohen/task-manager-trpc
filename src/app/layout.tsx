import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";
import { AppLayout } from "@/components/app-layout";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: "Task Manager",
	description: "A small task manager built with Next.js and tRPC",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" {...mantineHtmlProps}>
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<Providers>
					<AppLayout>{children}</AppLayout>
				</Providers>
			</body>
		</html>
	);
}
