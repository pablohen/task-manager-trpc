import { locale as localeParam } from "next/root-params";
import { cache } from "react";
import { createIntl } from "react-intl/server";
import { defaultLocale, isLocale } from "./config";
import { messages } from "./messages";

export const getLocale = cache(async () => {
	const locale = await localeParam();
	return isLocale(locale) ? locale : defaultLocale;
});

/** react-intl for server components, for the current request's locale. */
export const getIntl = cache(async () => {
	const locale = await getLocale();
	return createIntl({ locale, messages: messages[locale] });
});
