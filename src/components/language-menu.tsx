"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { CheckIcon, TranslateIcon } from "@phosphor-icons/react";
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
	const current = useLocale();

	const switchTo = (locale: Locale) => {
		// Remembered so the proxy picks it for locale-less URLs next time.
		// biome-ignore lint/suspicious/noDocumentCookie: a plain preference cookie
		document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
		// A full page load, not router.replace: the locale changes the whole
		// document (<html lang>, messages, providers), and a client navigation
		// would keep the old locale's tree mounted in the background.
		const { pathname, search } = window.location;
		const rest = pathname.slice(`/${current}`.length);
		window.location.replace(`/${locale}${rest}${search}`);
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
