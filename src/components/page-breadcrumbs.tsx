"use client";

import { Anchor, Breadcrumbs, Text } from "@mantine/core";
import Link from "next/link";

type Crumb = { label: string; href?: string };

/** The last crumb is the current page and isn't a link. */
export function PageBreadcrumbs({ items }: { items: Crumb[] }) {
	return (
		<nav aria-label="Breadcrumb">
			<Breadcrumbs>
				{items.map((item) =>
					item.href ? (
						<Anchor
							key={item.label}
							component={Link}
							href={item.href}
							size="sm"
						>
							{item.label}
						</Anchor>
					) : (
						<Text key={item.label} size="sm" c="dimmed" aria-current="page">
							{item.label}
						</Text>
					),
				)}
			</Breadcrumbs>
		</nav>
	);
}
