/**
 * Converts standard text into Bionic Reading HTML
 * Guiding the eye by highlighting the fixation point (first 30-50% of each word)
 */
export function formatToBionicHtml(text: string): string {
  if (!text) return '';

  return text
    .split(/(\s+)/)
    .map((token) => {
      // If it's whitespace or punctuation only, leave it unchanged
      if (/^\s+$/.test(token)) return token;

      // Extract alphanumeric portion vs trailing/leading punctuation
      const match = token.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9]+)([^a-zA-Z0-9]*)$/);
      if (!match) return token;

      const [, prefix, word, suffix] = match;
      if (word.length === 0) return token;

      let boldCount = 1;
      if (word.length >= 7) {
        boldCount = Math.ceil(word.length * 0.45);
      } else if (word.length >= 4) {
        boldCount = Math.ceil(word.length * 0.5);
      } else if (word.length === 3) {
        boldCount = 2;
      } else {
        boldCount = 1;
      }

      const boldPart = word.slice(0, boldCount);
      const restPart = word.slice(boldCount);

      return `${prefix}<strong class="font-extrabold text-brand-900 dark:text-brand-300">${boldPart}</strong>${restPart}${suffix}`;
    })
    .join('');
}

/**
 * Calculates estimated reading time
 */
export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  // Average reading speed: 180 words per minute for neurodivergent focus
  return Math.max(1, Math.ceil(words / 180));
}
