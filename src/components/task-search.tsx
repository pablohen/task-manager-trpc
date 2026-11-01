"use client";

import { CloseButton, Loader, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useIntl } from "react-intl";
import { useLocalizedPath } from "@/i18n/client";

// The term lives in the list's URL (/?q=) so results are server-rendered and
// shareable. The box sits in the header, so searching from another page
// navigates to the list.
export function TaskSearch() {
	const intl = useIntl();
	const router = useRouter();
	const localize = useLocalizedPath();
	const onList = usePathname() === localize("/");
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
		const href = localize(q ? `/?q=${encodeURIComponent(q)}` : "/");
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
			aria-label={intl.formatMessage({ id: "search.label" })}
			placeholder={intl.formatMessage({ id: "search.label" })}
			leftSection={<MagnifyingGlassIcon />}
			rightSection={
				isPending ? (
					<Loader size="xs" />
				) : (
					value && (
						<CloseButton
							aria-label={intl.formatMessage({ id: "search.clear" })}
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
	const label = useIntl().formatMessage({ id: "search.label" });
	return (
		<TextInput
			aria-label={label}
			placeholder={label}
			leftSection={<MagnifyingGlassIcon />}
			disabled
		/>
	);
}
