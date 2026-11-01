import type { Locale } from "../config";
import { en, type MessageId, type Messages } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export type { MessageId, Messages };

export const messages: Record<Locale, Messages> = { en, pt, es };

// Makes react-intl check message ids at compile time.
declare global {
	namespace FormatjsIntl {
		interface Message {
			ids: MessageId;
		}
	}
}
