import { messages } from "@/i18n/locales/messages";

export type Locale = keyof typeof messages;
export type MessageKey = keyof typeof messages.en;

export function translate(locale: Locale, key: MessageKey) {
  return messages[locale][key];
}

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "es";
}
