import { memo, type KeyboardEvent } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { LicenseRecord } from "@/features/licenses/types";
import { formatDate, formatRelativeDays } from "@/features/licenses/utils/format";
import { getAvatarColor } from "@/features/licenses/utils/avatar-color";
import { isRenewalUrgent } from "@/features/licenses/utils/license-status";
import { LicenseStatusBadge } from "./LicenseStatusBadge";
import { SeatsBar } from "./SeatsBar";

interface LicenseTableRowProps {
  license: LicenseRecord;
  onSelect: (id: string) => void;
}

function LicenseTableRowImpl({ license, onSelect }: LicenseTableRowProps) {
  // Plain functions, not useCallback: they're only used as this row's own
  // DOM event handlers, never passed to a memoized child, so memoizing them
  // would add hook overhead with no re-render to prevent.
  function handleActivate() {
    onSelect(license.id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTableRowElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  }

  return (
    <TableRow
      hover
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`View details for ${license.customerName}`}
      sx={{ cursor: "pointer", "&:focus-visible": { outline: "2px solid", outlineOffset: "-2px", outlineColor: "primary.main" } }}
    >
      <TableCell>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
          <Avatar
            aria-hidden="true"
            sx={{ width: 28, height: 28, fontSize: 13, fontWeight: 600, bgcolor: getAvatarColor(license.customerName) }}
          >
            {license.customerName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {license.customerName}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {license.plan}
        </Typography>
      </TableCell>
      <TableCell>
        <LicenseStatusBadge status={license.status} />
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {license.seatsUsed} / {license.seatsAllowed}
        </Typography>
        <SeatsBar seatsUsed={license.seatsUsed} seatsAllowed={license.seatsAllowed} />
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {formatDate(license.renewalDate)}
        </Typography>
        {isRenewalUrgent(license.status) && (
          <Typography variant="caption" color="text.disabled" component="div">
            {formatRelativeDays(license.renewalDate)}
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
}

export const LicenseTableRow = memo(LicenseTableRowImpl);
