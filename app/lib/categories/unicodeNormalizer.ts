type NormalizationOptions = {
  foldConfusables?: boolean;
  applyKnownBgFixes?: boolean;
};

const ZERO_WIDTH_RE = /[\u200B-\u200D\uFEFF]/g;
const INVISIBLE_SPACE_RE = /[\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000]/g;

const CYR_TO_LAT_CONFUSABLE: Record<string, string> = {
  а: "a",
  е: "e",
  о: "o",
  р: "p",
  с: "c",
  у: "y",
  х: "x",
  і: "i",
  ј: "j",
  к: "k",
  м: "m",
  т: "t",
  в: "b",
  н: "h",
  ё: "e",
};

const KNOWN_BG_REPLACEMENTS: Array<[RegExp, string]> = [
  [/Парoизолация/g, "Пароизолация"],
];

export function normalizeToNfc(value: string): string {
  return value.normalize("NFC");
}

export function stripZeroWidthAndInvisibleSpaces(value: string): string {
  return value
    .replace(ZERO_WIDTH_RE, "")
    .replace(INVISIBLE_SPACE_RE, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function applyKnownBulgarianReplacements(value: string): string {
  let out = value;
  for (const [pattern, replacement] of KNOWN_BG_REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

export function foldConfusableCyrillicToLatin(value: string): string {
  return Array.from(value)
    .map((ch) => CYR_TO_LAT_CONFUSABLE[ch] ?? ch)
    .join("");
}

export function normalizeCategoryText(
  value: string,
  options: NormalizationOptions = {}
): string {
  const { foldConfusables = false, applyKnownBgFixes = true } = options;

  let out = normalizeToNfc(value);
  out = stripZeroWidthAndInvisibleSpaces(out);

  if (applyKnownBgFixes) {
    out = applyKnownBulgarianReplacements(out);
  }

  if (foldConfusables) {
    out = foldConfusableCyrillicToLatin(out);
  }

  return out;
}

export function normalizedComparableKey(value: string): string {
  return normalizeCategoryText(value, {
    foldConfusables: true,
    applyKnownBgFixes: true,
  }).toLowerCase();
}
