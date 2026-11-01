"use client";

import type { TRPCClientErrorLike } from "@trpc/client";
import { useIntl } from "react-intl";
import type { AppRouter } from "@/server/routers/_app";
import { type Locale, localizePath } from "./config";
import { en, type MessageId } from "./messages/en";

export const useLocale = () => useIntl().locale as Locale;

/** Prefixes app paths ("/tasks/new") with the current locale. */
export function useLocalizedPath() {
	const locale = useLocale();
	return (path: string) => localizePath(locale, path);
}

const isMessageId = (value: string): value is MessageId => value in en;

/** Translates a message id (e.g. a validation error); other text is kept. */
export function useTranslateMessage() {
	const intl = useIntl();
	return (message: string | undefined) =>
		message && isMessageId(message)
			? intl.formatMessage({ id: message })
			: message;
}

/** A user-facing, translated message for a failed tRPC call. */
export function useErrorMessage() {
	const intl = useIntl();
	return (error: TRPCClientErrorLike<AppRouter>) => {
		if (error.data?.code === "NOT_FOUND") {
			return intl.formatMessage({ id: "error.notFound" });
		}
		return isMessageId(error.message)
			? intl.formatMessage({ id: error.message })
			: intl.formatMessage({ id: "error.generic" });
	};
}
