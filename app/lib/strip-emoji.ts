// removes emoji and pictographic symbols from free-text input while leaving
// real letters alone (accents, cjk, etc). targets emoji codepoints only, never
// "non-ascii", so names like josé, müller, 田中 pass through untouched.
const EMOJI =
  /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}]/gu

export const stripEmoji = (v: string) => v.replace(EMOJI, '')
