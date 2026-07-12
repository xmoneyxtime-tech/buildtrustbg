/**
 * Localized Data Utility
 * 
 * Provides functions to get localized categories, cities, and services
 * based on the selected language. All values are sourced from the translation system.
 */

import type { Language } from './i18n/types';
import { bgTranslations } from './i18n/bg';
import { enTranslations } from './i18n/en';
import { sortByLocale, sortStringsByLocale } from './sorting';

/**
 * Get translation object for the specified language
 */
function getTranslationForLanguage(language: Language) {
  return language === 'bg' ? bgTranslations : enTranslations;
}

/**
 * Get array of localized service categories
 * 
 * @example
 * const categories = getLocalizedCategories('en');
 * // Returns: ["House Construction", "General Renovation", ...]
 */
export function getLocalizedCategories(language: Language): string[] {
  const translations = getTranslationForLanguage(language);
  return sortStringsByLocale(Object.values(translations.categories), language);
}

/**
 * Get array of localized cities
 * 
 * @example
 * const cities = getLocalizedCities('bg');
 * // Returns: ["София", "Пловдив", ...]
 */
export function getLocalizedCities(language: Language): string[] {
  const translations = getTranslationForLanguage(language);
  return sortStringsByLocale(Object.values(translations.cities), language);
}

/**
 * Get array of localized services as objects with value and label
 * Useful for select/dropdown elements
 * 
 * @example
 * const services = getLocalizedServices('en');
 * // Returns: [
 * //   { value: "house-construction", label: "House Construction" },
 * //   { value: "general-renovation", label: "General Renovation" },
 * //   ...
 * // ]
 */
export function getLocalizedServices(language: Language): Array<{ value: string; label: string }> {
  const translations = getTranslationForLanguage(language);
  const categoryMap: Record<string, string> = {
    houseConstruction: 'house-construction',
    generalRenovation: 'general-renovation',
    roofing: 'roofing',
    insulation: 'insulation',
    electrical: 'electrical',
    plumbing: 'plumbing',
    architecture: 'architecture',
    interiorDesign: 'interior-design',
    painting: 'painting',
    flooring: 'flooring',
    windowsDoors: 'windows-doors',
    hvac: 'hvac',
    landscaping: 'landscaping',
    demolition: 'demolition',
    excavation: 'excavation',
  };

  return sortByLocale(
    Object.entries(translations.categories).map(([key, label]) => ({
      value: categoryMap[key] || key,
      label,
    })),
    language,
    (item) => item.label
  );
}

/**
 * Get mapping of city keys to localized city names
 * Useful for displaying specific cities by their key
 * 
 * @example
 * const cityMap = getLocalizedCityMap('en');
 * console.log(cityMap.sofia); // "Sofia"
 */
export function getLocalizedCityMap(language: Language): Record<string, string> {
  const translations = getTranslationForLanguage(language);
  return translations.cities as Record<string, string>;
}

/**
 * Get mapping of category keys to localized category names
 * Useful for displaying specific categories by their key
 * 
 * @example
 * const categoryMap = getLocalizedCategoryMap('bg');
 * console.log(categoryMap.houseConstruction); // "Строителство на къщи"
 */
export function getLocalizedCategoryMap(language: Language): Record<string, string> {
  const translations = getTranslationForLanguage(language);
  return translations.categories as Record<string, string>;
}

/**
 * Get featured categories with localized titles and descriptions
 * Used for the home page featured section
 * 
 * @example
 * const featured = getLocalizedFeaturedCategories('en');
 */
export function getLocalizedFeaturedCategories(language: Language) {
  const t = getTranslationForLanguage(language);
  const categoryMap = t.categories as Record<string, string>;
  
  const descriptions: Record<string, string> = language === 'bg' ? {
    houseConstruction: 'Планиране и изпълнение на нови жилищни и търговски сгради.',
    generalRenovation: 'Реновиране, обновяване и преустройство с фокус върху качеството.',
    roofing: 'Монтаж, подмяна и поддръжка на покривни конструкции и покрития.',
    insulation: 'Топлоизолация, звукоизолация и енергийна ефективност за всяка сграда.',
    electrical: 'Електрически инсталации, осветление и безопасност на обектите.',
    plumbing: 'Водоснабдяване, канализация, отопление и подово отопление.',
    architecture: 'Проектиране, концепции и координация за архитектурни решения.',
    interiorDesign: 'Функционални и естетични решения за вътрешни пространства.',
    painting: 'Боядисване на помещения, фасади и външни повърхности.',
    flooring: 'Монтаж и поддръжка на всички видове подови настилки.',
    windowsDoors: 'Монтаж и замяна на прозорци, врати и еркери.',
    hvac: 'Монтаж, поддръжка и ремонт на отопление и климатизация.',
    landscaping: 'Озеленяване, поддръжка на градини и благоустройство.',
    demolition: 'Събаряне и разбор на сгради и конструкции.',
    excavation: 'Земни работи, копаене и преместване на земя.',
  } : {
    houseConstruction: 'Planning and construction of new residential and commercial buildings.',
    generalRenovation: 'Renovation, restoration and restructuring with focus on quality.',
    roofing: 'Installation, replacement and maintenance of roofing structures and coverings.',
    insulation: 'Thermal insulation, soundproofing and energy efficiency for every building.',
    electrical: 'Electrical installations, lighting and facility safety systems.',
    plumbing: 'Water supply, sewage, heating and underfloor heating systems.',
    architecture: 'Design, concepts and coordination for architectural solutions.',
    interiorDesign: 'Functional and aesthetic solutions for interior spaces.',
    painting: 'Painting of rooms, facades and exterior surfaces.',
    flooring: 'Installation and maintenance of all types of flooring.',
    windowsDoors: 'Installation and replacement of windows, doors and bay windows.',
    hvac: 'Installation, maintenance and repair of heating and air conditioning.',
    landscaping: 'Landscaping, garden maintenance and beautification.',
    demolition: 'Demolition and deconstruction of buildings and structures.',
    excavation: 'Earthwork, excavation and soil displacement.',
  };

  const icons = {
    houseConstruction: '🏠',
    generalRenovation: '🛠️',
    roofing: '🏡',
    insulation: '❄️',
    electrical: '⚡',
    plumbing: '💧',
    architecture: '📐',
    interiorDesign: '🪑',
    painting: '🎨',
    flooring: '🏗️',
    windowsDoors: '🪟',
    hvac: '❄️',
    landscaping: '🌿',
    demolition: '💥',
    excavation: '⛏️',
  } as Record<string, string>;

  const accents = {
    houseConstruction: 'from-[#0F4C81]/10 to-[#F58220]/10',
    generalRenovation: 'from-[#0F4C81]/10 to-[#0EA5E9]/10',
    roofing: 'from-[#F58220]/10 to-[#FACC15]/10',
    insulation: 'from-[#0EA5E9]/10 to-[#0F4C81]/10',
    electrical: 'from-[#F58220]/10 to-[#0F4C81]/10',
    plumbing: 'from-[#0EA5E9]/10 to-[#22C55E]/10',
    architecture: 'from-[#0F4C81]/10 to-[#1D4ED8]/10',
    interiorDesign: 'from-[#F58220]/10 to-[#DB2777]/10',
    painting: 'from-[#DB2777]/10 to-[#EC4899]/10',
    flooring: 'from-[#22C55E]/10 to-[#16A34A]/10',
    windowsDoors: 'from-[#0EA5E9]/10 to-[#06B6D4]/10',
    hvac: 'from-[#0EA5E9]/10 to-[#0F4C81]/10',
    landscaping: 'from-[#22C55E]/10 to-[#84CC16]/10',
    demolition: 'from-[#EF4444]/10 to-[#DC2626]/10',
    excavation: 'from-[#92400E]/10 to-[#B45309]/10',
  } as Record<string, string>;

  return sortByLocale(
    Object.entries(categoryMap).map(([key, title]) => ({
      title,
      description: descriptions[key] || '',
      icon: icons[key] || '🏢',
      accent: accents[key] || 'from-[#0F4C81]/10 to-[#F58220]/10',
    })),
    language,
    (item) => item.title
  );
}
