import en from "@/i18n/locales/en/builder";
import hi from "@/i18n/locales/hi/builder";
import mr from "@/i18n/locales/mr/builder";
import ta from "@/i18n/locales/ta/builder";
import te from "@/i18n/locales/te/builder";

export const messages = {
  en,
  hi: { ...en, ...hi },
  mr: { ...en, ...mr },
  ta: { ...en, ...ta },
  te: { ...en, ...te },
};

export const localeNames = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
  ta: "தமிழ்",
  te: "తెలుగు",
} satisfies Record<keyof typeof messages, string>;

export type Locale = keyof typeof messages;
export type MessageKey = keyof typeof en;

export function translate(locale: Locale, key: MessageKey) {
  return messages[locale][key];
}

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && Object.hasOwn(messages, value);
}
