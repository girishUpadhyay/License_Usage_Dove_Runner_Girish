"use client";

import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { muiTheme } from "./muiTheme";

/**
 * Client-only wrapper so the theme object (which holds functions, e.g.
 * breakpoint helpers) is created on the client rather than passed across
 * the server/client boundary as a prop, which Next.js rejects.
 */
export function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={muiTheme} defaultMode="system">
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
