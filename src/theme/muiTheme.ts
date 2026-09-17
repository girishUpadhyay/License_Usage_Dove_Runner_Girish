import { createTheme } from "@mui/material/styles";

export type SemanticTone = "positive" | "caution" | "danger" | "neutral";

declare module "@mui/material/styles" {
  interface Palette {
    tone: Record<SemanticTone, Palette["primary"]>;
  }
  interface PaletteOptions {
    tone: Record<SemanticTone, PaletteOptions["primary"]>;
  }
}

/**
 * App-wide MUI theme. Adds a `tone` palette group (positive/caution/danger/
 * neutral) alongside MUI's defaults, since license status and seat
 * utilization both need that 4-way semantic scale rather than raw colors.
 *
 * `colorSchemes` gives us both a light and a dark palette in one theme;
 * MUI switches between them automatically based on the OS/browser's
 * prefers-color-scheme (via CssBaseline), no manual toggle needed.
 */
export const muiTheme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#4f46e5" },
        // `dark` holds a deliberately darker shade of each tone, used as
        // text color on top of the pale `light` background (e.g. the status
        // Chip label) — `main` alone doesn't clear WCAG AA 4.5:1 there for
        // positive/danger, so text uses `dark` while dots/bars/borders
        // (rendered against the page background, not the pale tint) keep
        // using `main`.
        tone: {
          positive: { main: "#059669", light: "#ecfdf5", dark: "#047857" },
          caution: { main: "#b45309", light: "#fffbeb", dark: "#b45309" },
          danger: { main: "#dc2626", light: "#fef2f2", dark: "#b91c1c" },
          neutral: { main: "#52525b", light: "#f4f4f5", dark: "#52525b" },
        },
      },
    },
    dark: {
      palette: {
        primary: { main: "#818cf8" },
        tone: {
          positive: { main: "#34d399", light: "rgba(52, 211, 153, 0.16)", dark: "#34d399" },
          caution: { main: "#fbbf24", light: "rgba(251, 191, 36, 0.16)", dark: "#fbbf24" },
          danger: { main: "#f87171", light: "rgba(248, 113, 113, 0.16)", dark: "#f87171" },
          neutral: { main: "#a1a1aa", light: "rgba(161, 161, 170, 0.16)", dark: "#a1a1aa" },
        },
      },
    },
  },
  shape: { borderRadius: 8 },
});
