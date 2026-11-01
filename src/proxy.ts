import { type NextRequest, NextResponse } from "next/server";
import {
	defaultLocale,
	isLocale,
	LOCALE_COOKIE,
	matchLocale,
	stripLocale,
} from "@/i18n/config";

// Pages live under app/[locale]. English, the default, is served without a
// prefix (rewritten to /en internally); other locales keep theirs (/pt, /es).
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const prefix = pathname.split("/")[1];
	const url = request.nextUrl.clone();

	// /en/... is reachable without the prefix; keep one URL per page.
	if (prefix === defaultLocale) {
		url.pathname = stripLocale(pathname);
		return NextResponse.redirect(url);
	}
	if (isLocale(prefix)) return;

	// No prefix: English, unless the visitor chose (cookie) or prefers
	// (Accept-Language) another locale.
	const saved = request.cookies.get(LOCALE_COOKIE)?.value;
	const locale = isLocale(saved)
		? saved
		: matchLocale(request.headers.get("accept-language"));
	url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

	return locale === defaultLocale
		? NextResponse.rewrite(url)
		: NextResponse.redirect(url);
}

export const config = {
	// Skip the API, Next internals and files with an extension.
	matcher: ["/((?!api|_next|.*\\..*).*)"],
};
