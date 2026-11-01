"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { CheckIcon, TranslateIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import { useLocale } from "@/i18n/client";
import {
	LOCALE_COOKIE,
	type Locale,
	localeNames,
	locales,
} from "@/i18n/config";

export function LanguageMenu() {
	const intl = useIntl();
	const router = useRouter();
	const current = useLocale();

	const switchTo = (locale: Locale) => {
		// Remembered so the proxy picks it for locale-less URLs next time.
		// biome-ignore lint/suspicious/noDocumentCookie: a plain preference cookie
		document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
		// Read at click time: usePathname would need a Suspense boundary on
		// dynamic routes just to render this button.
		const { pathname, search } = window.location;
		const rest = pathname.slice(`/${current}`.length);
		router.replace(`/${locale}${rest}${search}`, {
			scroll: false,
		});
	};

	return (
		<Menu position="bottom-end">
			<Menu.Target>
				<ActionIcon
					variant="default"
					aria-label={intl.formatMessage({ id: "nav.language" })}
				>
					<TranslateIcon size={20} />
				</ActionIcon>
			</Menu.Target>
			<Menu.Dropdown>
				{locales.map((locale) => (
					<Menu.Item
						key={locale}
						lang={locale}
						onClick={() => switchTo(locale)}
						rightSection={locale === current && <CheckIcon size={16} />}
					>
						{localeNames[locale]}
					</Menu.Item>
				))}
			</Menu.Dropdown>
		</Menu>
	);
}
