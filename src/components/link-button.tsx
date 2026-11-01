"use client";

import { Button, type ButtonProps } from "@mantine/core";
import Link from "next/link";
import { useLocalizedPath } from "@/i18n/client";

// Server components can't pass `component={Link}` across the client boundary,
// so the polymorphic part lives here. `href` is locale-free ("/tasks/new").
export function LinkButton({
	href,
	...props
}: ButtonProps & { href: string; children: React.ReactNode }) {
	const localize = useLocalizedPath();
	return <Button component={Link} href={localize(href)} {...props} />;
}
