import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditSeatsForm } from "@/features/licenses/components/EditSeatsForm";
import type { LicenseRecord } from "@/features/licenses/types";
import { renderWithTheme } from "./test-utils";

const license: LicenseRecord = {
  id: "lic_001",
  customerName: "Acme Industries",
  plan: "Standard",
  status: "Active",
  seatsUsed: 10,
  seatsAllowed: 20,
  renewalDate: "2026-01-01T00:00:00.000Z",
  accountOwnerEmail: "owner@acme.com",
  createdDate: "2025-01-01T00:00:00.000Z",
  notes: "",
};

describe("EditSeatsForm", () => {
  it("disables save and shows an error for a value below seats used", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    renderWithTheme(<EditSeatsForm license={license} onSave={onSave} />);

    const input = screen.getByLabelText(/edit seats allowed/i);
    await user.clear(input);
    await user.type(input, "5");

    expect(await screen.findByText(/cannot be less than seats used/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("disables save when the value is unchanged", () => {
    renderWithTheme(<EditSeatsForm license={license} onSave={vi.fn()} />);
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("calls onSave with the parsed number for a valid change", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    renderWithTheme(<EditSeatsForm license={license} onSave={onSave} />);

    const input = screen.getByLabelText(/edit seats allowed/i);
    await user.clear(input);
    await user.type(input, "30");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(30));
    expect(await screen.findByText(/saved/i)).toBeInTheDocument();
  });

  it("surfaces a server-side error without crashing", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockRejectedValue(new Error("Network error"));
    renderWithTheme(<EditSeatsForm license={license} onSave={onSave} />);

    const input = screen.getByLabelText(/edit seats allowed/i);
    await user.clear(input);
    await user.type(input, "30");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });
});
