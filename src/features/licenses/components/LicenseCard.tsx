import { memo, type KeyboardEvent, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { LicenseRecord } from "@/features/licenses/types";
import { formatDate, formatRelativeDays } from "@/features/licenses/utils/format";
import { getAvatarColor } from "@/features/licenses/utils/avatar-color";
import { isRenewalUrgent } from "@/features/licenses/utils/license-status";
import { LicenseStatusBadge } from "./LicenseStatusBadge";
import { SeatsBar } from "./SeatsBar";

interface LicenseCardProps {
  license: LicenseRecord;
  onSelect: (id: string) => void;
}

interface CardFieldProps {
  label: string;
  children: ReactNode;
}

function CardField({ label, children }: CardFieldProps) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" component="div">
        {label}
      </Typography>
      {children}
    </Box>
  );
}

function LicenseCardImpl({ license, onSelect }: LicenseCardProps) {
  // Plain functions, not useCallback: see LicenseTableRow for rationale.
  function handleActivate() {
    onSelect(license.id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  }

  return (
    <Box
      role="button"
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`View details for ${license.customerName}`}
      sx={{
        p: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:focus-visible": { outline: "2px solid", outlineOffset: "-2px", outlineColor: "primary.main" },
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", mb: 1.5 }}>
        <Avatar
          aria-hidden="true"
          sx={{ width: 32, height: 32, fontSize: 14, fontWeight: 600, bgcolor: getAvatarColor(license.customerName) }}
        >
          {license.customerName.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }}>
          {license.customerName}
        </Typography>
        <LicenseStatusBadge status={license.status} />
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
        }}
      >
        <CardField label="Plan">
          <Typography variant="body2">{license.plan}</Typography>
        </CardField>

        <CardField label="Renewal date">
          <Typography variant="body2">{formatDate(license.renewalDate)}</Typography>
          {isRenewalUrgent(license.status) && (
            <Typography variant="caption" color="text.disabled" component="div">
              {formatRelativeDays(license.renewalDate)}
            </Typography>
          )}
        </CardField>

        <CardField label="Seats used / allowed">
          <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
            {license.seatsUsed} / {license.seatsAllowed}
          </Typography>
          <SeatsBar seatsUsed={license.seatsUsed} seatsAllowed={license.seatsAllowed} />
        </CardField>
      </Box>
    </Box>
  );
}

export const LicenseCard = memo(LicenseCardImpl);
