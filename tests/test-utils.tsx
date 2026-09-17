import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { muiTheme } from "@/theme/muiTheme";

/** Renders with the app's MUI theme so components using useTheme() (status tones, etc.) work in tests. */
export function renderWithTheme(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: ({ children }) => <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>, ...options });
}
