/**
 * translate.ts
 *
 * Lightweight translation helper that uses the free, unofficial
 * Google Translate endpoint.  No API key required.
 * Falls back silently on network errors so transcription always works.
 */

/**
 * Translate `text` from auto-detected language to Spanish.
 * Returns the translated string, or the original text if translation fails.
 */
export async function translateToSpanish(text: string): Promise<string> {
  if (!text.trim()) return text;

  try {
    const url =
      "https://translate.googleapis.com/translate_a/single" +
      `?client=gtx&sl=auto&tl=es&dt=t&q=${encodeURIComponent(text)}`;

    const res = await fetch(url);
    if (!res.ok) return text;

    // Response is a nested array: [[["translated","original",...]], ...]
    const json = await res.json();
    if (!Array.isArray(json) || !Array.isArray(json[0])) return text;

    const translated = (json[0] as [string, string][])
      .map((chunk) => chunk[0] ?? "")
      .join("");

    return translated || text;
  } catch {
    return text;
  }
}
