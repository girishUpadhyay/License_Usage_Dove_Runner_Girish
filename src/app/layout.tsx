import type { Metadata } from "next";
import { AppThemeProvider } from "@/theme/AppThemeProvider";

export const metadata: Metadata = {
  title: "License Usage Admin",
  description: "Internal admin screen for customer license records.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
