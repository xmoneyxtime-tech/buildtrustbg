export function createLocaleCollator(locale: string) {
  return new Intl.Collator(locale, {
    usage: "sort",
    sensitivity: "base",
    numeric: true,
  });
}

export function sortByLocale<T>(items: T[], locale: string, getValue: (item: T) => string | null | undefined): T[] {
  const collator = createLocaleCollator(locale);

  return [...items].sort((left, right) => collator.compare(getValue(left) ?? "", getValue(right) ?? ""));
}

export function sortStringsByLocale(items: string[], locale: string): string[] {
  return sortByLocale(items, locale, (item) => item);
}