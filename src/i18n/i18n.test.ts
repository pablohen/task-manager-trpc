import { createIntl } from "react-intl/server";
import { describe, expect, it } from "vitest";
import { locales, localizePath, matchLocale, stripLocale } from "./config";
import { type MessageId, messages } from "./messages";

describe("matchLocale", () => {
	it("picks the highest-weighted supported language", () => {
		expect(matchLocale("fr-FR,es;q=0.8,pt-BR;q=0.9")).toBe("pt");
	});

	it("matches a region variant to its base language", () => {
		expect(matchLocale("es-MX")).toBe("es");
	});

	it("falls back to English", () => {
		expect(matchLocale("fr,de;q=0.5")).toBe("en");
		expect(matchLocale(null)).toBe("en");
	});
});

describe("localizePath", () => {
	it("prefixes paths with non-default locales", () => {
		expect(localizePath("pt", "/")).toBe("/pt");
		expect(localizePath("es", "/tasks/new")).toBe("/es/tasks/new");
		expect(localizePath("pt", "/?q=milk")).toBe("/pt?q=milk");
	});

	it("leaves English paths unprefixed", () => {
		expect(localizePath("en", "/")).toBe("/");
		expect(localizePath("en", "/tasks/new")).toBe("/tasks/new");
		expect(localizePath("en", "/?q=milk")).toBe("/?q=milk");
	});
});

describe("stripLocale", () => {
	it("removes a locale prefix", () => {
		expect(stripLocale("/pt")).toBe("/");
		expect(stripLocale("/es/tasks/new")).toBe("/tasks/new");
		expect(stripLocale("/en/tasks/new")).toBe("/tasks/new");
	});

	it("keeps paths without one", () => {
		expect(stripLocale("/")).toBe("/");
		expect(stripLocale("/tasks/new")).toBe("/tasks/new");
	});
});

describe("messages", () => {
	it("has the same keys in every locale", () => {
		const keys = Object.keys(messages.en).sort();
		for (const locale of locales) {
			expect(Object.keys(messages[locale]).sort()).toEqual(keys);
		}
	});

	it("formats every message in every locale", () => {
		for (const locale of locales) {
			const intl = createIntl({
				locale,
				messages: messages[locale],
				onError: (error) => {
					throw error;
				},
			});
			for (const id of Object.keys(messages[locale]) as MessageId[]) {
				expect(() =>
					intl.formatMessage({ id }, { title: "x", search: "x" }),
				).not.toThrow();
			}
		}
	});
});
