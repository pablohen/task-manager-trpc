export const locales = ["en", "pt", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
	en: "English",
	pt: "Português",
	es: "Español",
};

/** Remembers an explicit choice from the language switcher. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const isLocale = (value: string | undefined): value is Locale =>
	(locales as readonly string[]).includes(value ?? "");

/** Picks the best supported locale from an Accept-Language header. */
export function matchLocale(acceptLanguage: string | null): Locale {
	const ranked = (acceptLanguage ?? "")
		.split(",")
		.map((part) => {
			const [tag, ...params] = part.trim().split(";");
			const q = params.find((p) => p.trim().startsWith("q="));
			return {
				language: tag.split("-")[0].toLowerCase(),
				weight: q ? Number(q.trim().slice(2)) : 1,
			};
		})
		.sort((a, b) => b.weight - a.weight);

	return (
		(ranked.find((entry) => isLocale(entry.language))?.language as
			| Locale
			| undefined) ?? defaultLocale
	);
}

/**
 * English, the default, has no prefix: "/tasks/new" stays as is for `en` and
 * becomes "/pt/tasks/new" for `pt` ("/" → "/pt", "/?q=x" → "/pt?q=x").
 */
export function localizePath(locale: Locale, path: string) {
	if (locale === defaultLocale) return path;
	return `/${locale}${path.startsWith("/?") || path === "/" ? path.slice(1) : path}`;
}

/** "/pt/tasks/new" → "/tasks/new"; paths without a locale are unchanged. */
export function stripLocale(pathname: string) {
	const [, first, ...rest] = pathname.split("/");
	return isLocale(first) ? `/${rest.join("/")}` : pathname;
}
