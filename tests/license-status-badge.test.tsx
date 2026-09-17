import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { LicenseStatusBadge } from "@/features/licenses/components/LicenseStatusBadge";
import { renderWithTheme } from "./test-utils";

describe("LicenseStatusBadge", () => {
  it.each(["Active", "Expiring Soon", "Expired", "Suspended"] as const)(
    "renders the %s label",
    (status) => {
      renderWithTheme(<LicenseStatusBadge status={status} />);
      expect(screen.getByText(status)).toBeInTheDocument();
    }
  );
});
