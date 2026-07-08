/**
 * BuildTrustBG i18n System
 * Centralized internationalization with support for multiple languages
 * Currently supports: Bulgarian (bg), English (en)
 * Easily extensible for future languages
 */

export { TranslationProvider, useTranslation } from "./translations";
export type { Language, Translations } from "./types";
export { bgTranslations } from "./bg";
export { enTranslations } from "./en";
