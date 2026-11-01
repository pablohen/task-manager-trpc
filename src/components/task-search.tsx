"use client";

import { CloseButton, Loader, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

// The term lives in the URL (?q=) so search results are server-rendered and
// shareable; the list reads it from there.
export function TaskSearch() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [value, setValue] = useState(searchParams.get("q") ?? "");
	const [isPending, startTransition] = useTransition();

	const updateUrl = useDebouncedCallback((term: string) => {
		const params = new URLSearchParams(searchParams);
		if (term.trim()) params.set("q", term.trim());
		else params.delete("q");
		const query = params.toString();
		startTransition(() => {
			router.replace(query ? `${pathname}?${query}` : pathname, {
				scroll: false,
			});
		});
	}, 300);

	const search = (term: string) => {
		setValue(term);
		updateUrl(term);
	};

	return (
		<TextInput
			type="search"
			aria-label="Search tasks"
			placeholder="Search by title or description"
			leftSection={<MagnifyingGlassIcon />}
			rightSection={
				isPending ? (
					<Loader size="xs" />
				) : (
					value && (
						<CloseButton
							aria-label="Clear search"
							onClick={() => {
								search("");
								updateUrl.flush();
							}}
						/>
					)
				)
			}
			value={value}
			onChange={(event) => search(event.currentTarget.value)}
		/>
	);
}

export function TaskSearchFallback() {
	return (
		<TextInput
			aria-label="Search tasks"
			placeholder="Search by title or description"
			leftSection={<MagnifyingGlassIcon />}
			disabled
		/>
	);
}
