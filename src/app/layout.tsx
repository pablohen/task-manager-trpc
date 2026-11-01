import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { ColorSchemeScript, Container, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";
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
					<Container size="sm" py={{ base: "md", sm: "xl" }}>
						{children}
					</Container>
				</Providers>
			</body>
		</html>
	);
}
