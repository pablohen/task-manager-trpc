import { type NextRequest, NextResponse } from "next/server";
import { isLocale, LOCALE_COOKIE, matchLocale } from "@/i18n/config";

// Every page lives under /{locale}. Requests without one are redirected to
// the language picked earlier (cookie) or the browser's preferred one.
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	if (isLocale(pathname.split("/")[1])) return;

	const saved = request.cookies.get(LOCALE_COOKIE)?.value;
	const locale = isLocale(saved)
		? saved
		: matchLocale(request.headers.get("accept-language"));

	const url = request.nextUrl.clone();
	url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
	return NextResponse.redirect(url);
}

export const config = {
	// Skip the API, Next internals and files with an extension.
	matcher: ["/((?!api|_next|.*\\..*).*)"],
};
