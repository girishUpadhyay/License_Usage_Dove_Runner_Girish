"use client";

import { useState, type FormEvent } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import type { LicenseRecord } from "@/features/licenses/types";
import { validateSeatsAllowed } from "@/features/licenses/utils/license-validation";

interface EditSeatsFormProps {
  license: LicenseRecord;
  onSave: (seatsAllowed: number) => Promise<void>;
}

export function EditSeatsForm({ license, onSave }: EditSeatsFormProps) {
  const [value, setValue] = useState(String(license.seatsAllowed));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const seatsAllowed = Number(value);
  const validationError =
    value.trim() === "" ? "Enter a number." : validateSeatsAllowed(seatsAllowed, license.seatsUsed);
  const error = validationError ?? saveError;
  const isUnchanged = seatsAllowed === license.seatsAllowed;

  function handleChange(next: string) {
    setValue(next);
    setSaveError(null);
    setSaved(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (validationError) return;

    setSaving(true);
    setSaveError(null);
    try {
      await onSave(seatsAllowed);
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
        <TextField
          label="Edit seats allowed"
          type="number"
          size="small"
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          error={Boolean(error)}
          helperText={error ?? " "}
          slotProps={{ htmlInput: { min: 0, inputMode: "numeric" } }}
          sx={{ width: 140 }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={saving || isUnchanged || Boolean(validationError)}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : undefined}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </Stack>

      <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.5 }}>
        Currently used: {license.seatsUsed} seats.
      </Typography>

      {!error && saved && (
        <Stack direction="row" spacing={0.5} sx={{ mt: 1, alignItems: "center" }} role="status">
          <CheckIcon fontSize="small" color="success" />
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 500 }}>
            Saved.
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
