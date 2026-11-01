"use client";

import { CloseButton, Loader, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

// The term lives in the list's URL (/?q=) so results are server-rendered and
// shareable. The box sits in the header, so searching from another page
// navigates to the list.
export function TaskSearch() {
	const router = useRouter();
	const onList = usePathname() === "/";
	const urlTerm = useSearchParams().get("q") ?? "";
	const listTerm = onList ? urlTerm : "";
	const [value, setValue] = useState(listTerm);
	const [isPending, startTransition] = useTransition();

	// Follow URL changes made elsewhere (leaving the list, back/forward), but
	// don't fight the user's own typing, e.g. a trailing space.
	useEffect(() => {
		setValue((current) => (current.trim() === listTerm ? current : listTerm));
	}, [listTerm]);

	const updateUrl = useDebouncedCallback((term: string) => {
		const q = term.trim();
		if (!onList && !q) return;
		const href = q ? `/?q=${encodeURIComponent(q)}` : "/";
		startTransition(() => {
			if (onList) router.replace(href, { scroll: false });
			else router.push(href);
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
			placeholder="Search tasks"
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
			placeholder="Search tasks"
			leftSection={<MagnifyingGlassIcon />}
			disabled
		/>
	);
}
