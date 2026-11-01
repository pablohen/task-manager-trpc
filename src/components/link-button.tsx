"use client";

import { Button, type ButtonProps } from "@mantine/core";
import Link from "next/link";

// Server components can't pass `component={Link}` across the client boundary,
// so the polymorphic part lives here.
export function LinkButton({
	href,
	...props
}: ButtonProps & { href: string; children: React.ReactNode }) {
	return <Button component={Link} href={href} {...props} />;
}
