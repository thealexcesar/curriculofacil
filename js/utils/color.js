/**
 * Small color helpers for the custom résumé accent color.
 *
 * The accent is used for text - job title and section headings - so it has
 * to clear WCAG AA (4.5:1 against white) and still read when the résumé is
 * printed in black & white. Rather than let any color through and correct
 * it afterwards (a pale yellow silently becoming dark olive is confusing),
 * the custom picker only exposes the hue: saturation and lightness are
 * pinned to a range where every possible result is already dark enough.
 */

const AA_CONTRAST = 4.5;

/** Fixed saturation/lightness for custom hues - deep and slightly muted,
 * in the same register as the hand-picked presets. */
const CUSTOM_SATURATION = 0.62;
const CUSTOM_LIGHTNESS = 0.26;

/**
 * @param {string} hex - '#rrggbb'
 * @returns {{r: number, g: number, b: number}} 0-255
 */
function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

/**
 * @param {{r: number, g: number, b: number}} rgb
 * @returns {string}
 */
function rgbToHex({ r, g, b }) {
  const toHex = n => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * WCAG relative luminance.
 *
 * @param {string} hex
 * @returns {number} 0-1
 */
function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channel = c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * WCAG contrast ratio between two colors (order doesn't matter).
 *
 * @param {string} hexA
 * @param {string} hexB
 * @returns {number} 1-21
 */
export function contrastRatio(hexA, hexB) {
  const a = luminance(hexA);
  const b = luminance(hexB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/**
 * @param {string} hex
 * @param {number} amount - 0-1, fraction of the way toward black
 * @returns {string}
 */
function darken(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({ r: r * (1 - amount), g: g * (1 - amount), b: b * (1 - amount) });
}

/**
 * @param {string} hex
 * @param {number} amount - 0-1, fraction of the way toward white
 * @returns {string}
 */
function lighten(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: r + (255 - r) * amount,
    g: g + (255 - g) * amount,
    b: b + (255 - b) * amount,
  });
}

/**
 * @param {number} h - hue, 0-360
 * @param {number} s - saturation, 0-1
 * @param {number} l - lightness, 0-1
 * @returns {string}
 */
function hslToHex(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0]
    : h < 120 ? [x, c, 0]
    : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c]
    : h < 300 ? [x, 0, c]
    : [c, 0, x];
  return rgbToHex({ r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 });
}

/** Slider position 0 is a neutral dark gray rather than a hue - the safest,
 * most conventional résumé accent, and the app's default. Keeping it as the
 * slider's first stop means "no color" is reachable from the same control
 * instead of needing a separate swatch. */
export const NEUTRAL_POSITION = 0;
/** Dark graphite (10.31:1) - still clearly gray rather than black, but
 * dark enough to carry a formal document. A mid gray reads as washed-out
 * text, especially printed on a cheap or low-toner printer where
 * mid-tones fade. */
const NEUTRAL_ACCENT = '#374151';

/**
 * Builds the accent/dark/light trio the résumé themes expect from a single
 * slider position. Saturation and lightness are fixed, so every position
 * already clears the contrast minimum - nothing has to be silently
 * corrected after the fact.
 *
 * @param {number} position - 0 for neutral gray, 1-360 for hues
 * @returns {{accent: string, dark: string, light: string}}
 */
export function paletteFromSlider(position) {
  const accent = position === NEUTRAL_POSITION
    ? NEUTRAL_ACCENT
    : hslToHex(position - 1, CUSTOM_SATURATION, CUSTOM_LIGHTNESS);

  return {
    accent,
    dark: darken(accent, 0.2),
    light: lighten(accent, 0.92),
  };
}

/**
 * Whether a slider position produces a readable accent. Used by the test
 * that sweeps the whole range.
 *
 * @param {number} position
 * @returns {boolean}
 */
export function positionMeetsContrast(position) {
  return contrastRatio(paletteFromSlider(position).accent, '#ffffff') >= AA_CONTRAST;
}
