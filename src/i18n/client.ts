"use client";

import { useIntl } from "react-intl";
import { type Locale, localizePath } from "./config";

export const useLocale = () => useIntl().locale as Locale;

/** Prefixes app paths ("/tasks/new") with the current locale. */
export function useLocalizedPath() {
	const locale = useLocale();
	return (path: string) => localizePath(locale, path);
}
