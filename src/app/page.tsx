import type { Metadata } from "next";
import { LicensesPageClient } from "@/features/licenses/components/LicensesPageClient";

export const metadata: Metadata = {
  title: "License Usage | Admin",
  description: "View, filter, and manage customer license records.",
};

export default function LicenseUsagePage() {
  return <LicensesPageClient />;
}
